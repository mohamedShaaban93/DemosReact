import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import I18n from 'react-native-i18n';
// import firebase from 'react-native-firebase';

const { CancelToken } = axios;

class Network extends PureComponent {
  static propTypes = {
    limit: PropTypes.number,
    paging: PropTypes.bool,
    apiRequest: PropTypes.shape({
      url: PropTypes.string.isRequired,
      responseResolver: PropTypes.func.isRequired,
      onError: PropTypes.func,
      ContentType: PropTypes.string,
      pageFieldName: PropTypes.string,
      limitFieldName: PropTypes.string,
      params: PropTypes.object,
    }),
    firebaseRequest: PropTypes.shape({
      collectionName: PropTypes.string.isRequired,
      onError: PropTypes.func,
      orderBy: PropTypes.string,
      desc: PropTypes.bool,
      conditions: PropTypes.arrayOf(PropTypes.array),
    }),
  };

  static defaultProps = {
    limit: 10,
    paging: true,
  };

  constructor(props) {
    super(props);

    this.page = 0;
    this.pageCount = 1;
    this.loading = false;
    this.firstFetchDone = false;

    if (props.apiRequest) {
      this.source = CancelToken.source();
    }

    if (props.firebaseRequest) {
      this.firebaseRef = firebase
        .firestore()
        .collection(props.firebaseRequest.collectionName);
      this.lastItem = null;
    }
  }

  componentDidMount() {
    this.loading = true;
    this.fetch(this.mainIndicator, true);
  }

  componentWillReceiveProps(nextProps, CB) {
    if (this.props.apiRequest) {
      if (
        nextProps.apiRequest.params &&
        JSON.stringify(nextProps.apiRequest.params) !==
          JSON.stringify(this.props.apiRequest.params)
      ) {
        this.reload();
        if (CB) CB();
      } else if (
        nextProps.apiRequest.url &&
        nextProps.apiRequest.url !== this.props.apiRequest.url
      ) {
        this.reload();
        if (CB) CB();
      }
    }
  }

  componentWillUnmount() {
    if (this.props.apiRequest) {
      this.source.cancel('Network Operation Canceled.');
    }
  }

  reload = () => {
    this.page = 0;
    this.setData([], () => {
      this.fetch(this.mainIndicator, true);
    });
  };

  apiLoadData = async (loadingIndicator, oldData = []) => {
    const { apiRequest, paging } = this.props;

    const {
      url,
      pageFieldName,
      limitFieldName,
      params,
      ContentType,
      responseResolver,
      onError,
      transformData,
    } = apiRequest;

    const pagingParams = {};

    if (paging) {
      pagingParams[pageFieldName || 'page'] = this.page;
      pagingParams[limitFieldName || 'limit'] = this.props.limit;
    }

    this.loading = true;

    try {
      const response = await axios.get(`${url}`, {
        cancelToken: this.source.token,
        params: {
          ...pagingParams,
          ...params,
        },
        headers: {
          'Content-Type': ContentType || 'application/json',
        },
      });

      this.loading = false;
      this.firstFetchDone = true;

      const { data, pageCount } = responseResolver(response);
      this.pageCount = pageCount || this.pageCount;
      this.page = response.data.page || 1;

      this.page++;

      let newData = data;

      if (transformData) {
        newData = data.map(item => transformData(item));
      }

      const allData = [...oldData, ...newData];

      this.setData(allData);
      this.setState({
        [loadingIndicator]: false,
      });

      this.setEndFetching(allData);
    } catch (error) {
      this.loading = false;
      if (!axios.isCancel(error)) {
        if (onError) {
          this.setError(onError(error));
        } else {
          this.setError(I18n.t('ui-error-happened'));
        }
        this.setState({
          [loadingIndicator]: false,
        });
      }
    }
  };

  firebaseLoadData = async (loadingIndicator, oldData = []) => {
    const {
      conditions,
      orderBy,
      desc,
      transformData,
      onError,
      populate,
    } = this.props.firebaseRequest;
    const data = [];

    try {
      let acc = this.firebaseRef;
      if (conditions && conditions.length) {
        conditions.forEach(condition => {
          acc = acc.where(condition[0], condition[1], condition[2]);
        });
      }
      if (orderBy) {
        if (desc) acc = acc.orderBy(orderBy, 'desc');
        else acc = acc.orderBy(orderBy);
      }

      if (this.props.paging) {
        this.pageCount = Math.ceil(
          (await acc.get()).docs.length / this.props.limit,
        );

        if (this.lastItem) {
          acc = acc.startAfter(this.lastItem).limit(this.props.limit);
        } else {
          acc = acc.limit(this.props.limit);
        }

        const tempSnapShot = await acc.limit(this.props.limit).get();
        this.lastItem = tempSnapShot.docs[tempSnapShot.docs.length - 1];
      }

      const querySnapshot = await acc.get();
      querySnapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id });
      });

      let newData = data;

      if (Array.isArray(populate) && populate.length) {
        for (let i = 0; i < populate.length; i++) {
          const field = populate[i];

          const promises = newData.map(async item => {
            const d = await (await item[field].get()).data();

            return {
              ...item,
              [field]: d,
            };
          });

          newData = await Promise.all(promises);
        }
      }

      if (transformData) {
        newData = data.map(item => transformData(item));
      }

      const allData = [...oldData, ...newData];

      this.setData(allData);
      this.setState({
        [loadingIndicator]: false,
      });

      this.setEndFetching(allData);
    } catch (error) {
      this.setError(onError(error));
      this.setState({
        [loadingIndicator]: false,
      });
    }
  };

  // append data by default
  async fetch(indicator, reset, d) {
    if (this.state[indicator]) return;
    if (!this.props.apiRequest && !this.props.firebaseRequest) return;

    this.setStartFetching();
    if (indicator === 'loading') {
      this.setState({
        [indicator]: true,
      });
    }
    const data = reset ? [] : d || this.state.dataProvider._data;
    this.page = reset ? 1 : this.page;
    this.lastItem = reset ? null : this.lastItem;

    if (this.props.apiRequest) {
      this.apiLoadData(indicator, data);
    } else if (this.props.firebaseRequest) {
      this.firebaseLoadData(indicator, data);
    }
  }

  render() {
    return <></>;
  }
}

export default Network;
