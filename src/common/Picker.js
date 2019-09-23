import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import I18n from 'react-native-i18n';

import { BasePropTypes } from './Base';
import Network from './Base/Network';
import View from './View';
import Text from './Text';
import Indicator from './Indicator';
import InputError from './micro/InputError';
import { getTheme } from './Theme';
import { AppView, AppText, AppNavigation } from '.';
import { responsiveHeight } from './utils/responsiveDimensions';

const styles = StyleSheet.create({
  modalReset: {
    padding: 0,
    margin: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Picker extends Network {
  static propTypes = {
    ...BasePropTypes,
    ...Network.propTypes,
    name: PropTypes.string,
    onChange: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.object),
    placeholder: PropTypes.string,
    leftItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    rightItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    farArrow: PropTypes.bool,
    error: PropTypes.string,
    noValidation: PropTypes.bool,
    setInitialValueAfterFetch: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string,
    ]),
    loadingIndicator: PropTypes.bool,
    contactUs: PropTypes.bool,
  };

  static defaultProps = {
    ...Network.defaultProps,
    ...getTheme().picker,
    placeholder: '',
    paging: false,
    farArrow: true,
    data: [],
    leftItems: [],
    rightItems: [],
    loadingIndicator: false,
    ph: 3,
    mh: 3,
    centerTextY: true,
    leftText: false,

    contactUs: false,
    label: true,
    labelStyle: true,
    errorTextMarginHorizontal: 11,
  };

  constructor(props) {
    super(props);

    // const obj = props.initialValue
    //   ? props.data.find(i => i.value === props.initialValue)
    //   : null;

    // const label = obj ? obj.label : props.placeholder;
    this.mainIndicator = 'loading';

    this.state = {
      label: props.placeholder,
      data: props.data,
      loading: false,
      networkError: false,
      filterText: '',
      isTouched: false,
    };
  }

  async componentDidMount() {
    if (!this.props.data || this.props.data.length === 0) {
      super.componentDidMount();
    }

    if (Array.isArray(this.props.data) && this.props.data.length) {
      this.setEndFetching(this.props.data);
    }
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps, () => {
      this.onChange({ label: this.props.placeholder, value: '' }, true);
    });
    this.setState({
      isTouched: nextProps.isTouched,
    });

    if (nextProps.reset !== this.props.reset) {
      this.clear();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  setStartFetching() {
    this.setState({
      networkError: false,
    });
  }

  setData = (data, cb) => {
    this.setState({ data }, cb);
  };

  setError = errorLabel => {
    this.setState({
      networkError: true,
    });
  };

  setEndFetching(data) {
    const { setInitialValueAfterFetch, onChange, name } = this.props;

    if (
      setInitialValueAfterFetch !== undefined &&
      data.length &&
      typeof setInitialValueAfterFetch === 'number'
    ) {
      let { label, value, dialCode } = data.find(
        item => item.value === setInitialValueAfterFetch,
      );
      const target = data.find(
        item => item.value === setInitialValueAfterFetch,
      );

      if (target) {
        label = target.label;
        value = target.value;
        dialCode = target.dialCode;

        this.onChange({ value, label, dialCode });
      }

      this.onChange({ value, label, dialCode });
    } else if (!data.length) {
      // this.setState({
      //   label: this.props.noResultsLabel || I18n.t('ui-noResultsFound'),
      // });
    }
  }

  onChange = ({ label, value, ...rest }, noValidate) => {
    const { name, onChange, addresses } = this.props;

    const selectedData = this.state.data.filter(item => item.value === value);

    this.setState({
      label,
      value,
    });

    if (onChange) {
      if (name) {
        onChange(name, value, noValidate, rest);
      } else if (addresses) {
        onChange(value, label, selectedData);
      } else onChange(value, label, rest);
      // else onChange(label, value);
    }
  };

  newSet = val => {
    this.setState({data:val});

  };

  clear = () => {
    this.onChange({ label: this.props.placeholder || '', value: '' }, true);
  };

  renderItems = items => {
    const { size, color } = this.props;

    const nodes = items.map(item => {
      if (
        item.type.WrappedComponent &&
        (item.type.WrappedComponent.displayName === 'Button' ||
          item.type.WrappedComponent.displayName === 'Icon')
      ) {
        return React.cloneElement(item, {
          key: String(Math.random()),
          transparent: true,
          stretch: item.type.WrappedComponent.displayName === 'Button',
          color: item.props.color || color,
          size: item.props.size || size * 1.5,
          backgroundColor: 'transparent',
          // paddingHorizontal:
          //   item.props.ph || item.props.ph == 0 ? item.props.ph : size / 1.5,
          paddingVertical: 0,
          justifyContent: 'center',
          marginTop: 0.5,
        });
      }
      return React.cloneElement(item, {
        key: String(Math.random()),
      });
    });

    return nodes;
  };

  render() {
    const {
      rtl,
      size,
      color,
      backgroundColor,
      width,
      height,
      borderRadius,
      center,
      farArrow,
      error,
      flex,
      elevation,
      onChange,
      name,
      noValidation,
      margin,
      marginHorizontal,
      marginVertical,
      marginLeft,
      marginRight,
      marginBottom,
      marginTop,
      m,
      mh,
      mv,
      mt,
      mb,
      ml,
      mr,
      bw,
      btw,
      bbw,
      blw,
      brw,
      bc,
      btc,
      bbc,
      blc,
      brc,
      hideSearch,
      title,
      searchTitle,
      iconType,
      iconName,
      touchableOpacity,
      disable,
      ph,
      centerTextY,
      leftText,
      borderColor,
      noBorder,
      labelStyle,
    } = this.props;

    const noBorders = {};
    if (noBorder) {
      noBorders.borderTopWidth = 0;
      noBorders.borderBottomWidth = 0;
      noBorders.elevation = 0;
    }
    let { leftItems, rightItems } = this.props;

    if (leftItems && !leftItems.map) leftItems = [leftItems];
    if (rightItems && !rightItems.map) rightItems = [rightItems];

    const ButtonContainer = touchableOpacity ? TouchableOpacity : RectButton;

    return (
      <View
        stretch
        flex={flex}
        m={m}
        // mh={mh}
        {...noBorders}
        mv={mv}
        mt={mt}
        mb={mb}
        ml={ml}
        mr={mr}
        margin={margin}
        marginVertical={marginVertical}
        marginHorizontal={marginHorizontal}
        marginLeft={marginLeft}
        marginRight={marginRight}
        marginTop={marginTop}
        marginBottom={marginBottom}
        width={width}
      >
        <View
          stretch
          row
          height={height}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          elevation={elevation}
          {...noBorders}
          bw={bw}
          btw={btw}
          bbw={bbw}
          blw={blw}
          brw={brw}
          borderColor={borderColor}
          bc={bc}
          btc={btc}
          bbc={bbc}
          blc={blc}
          brc={brc}
          style={{ overflow: 'visible' }}
          // ph={ph}
        >
          {this.state.label !== this.props.placeholder &&
          this.props.placeholder ? (
            <AppView
              marginHorizontal={this.props.icon ? 25 : labelStyle ? 16 : 32}
              paddingHorizontal={this.props.contactUs ? 6.5 : 3}
              borderRadius={this.props.contactUs ? undefined : 10}
              marginTop={
                this.props.icon
                  ? 2
                  : this.props.contactUs
                  ? labelStyle
                    ? undefined
                    : 4
                  : undefined
              }
              style={{
                position: 'absolute',
                top: this.props.contactUs
                  ? 3
                  : labelStyle
                  ? 0
                  : -responsiveHeight(3.5) / 2,
              }}
              height={3.5}
              center={!this.props.contactUs}
              backgroundColor={
                this.props.backgroundColorLabel
                  ? this.props.backgroundColorLabel
                  : this.props.contactUs
                  ? labelStyle
                    ? 'transparent'
                    : 'transparent'
                  : 'transparent'
              }
            >
              {this.props.placeholder && (
                <AppText
                  color="#8A8A8A"
                  size={0.8 * size}
                  marginTop={this.props.contactUs ? 0 : undefined}
                >
                  {this.props.placeholder}
                </AppText>
              )}
            </AppView>
          ) : null}

          {disable ? (
            <AppView
              style={[
                {
                  flexDirection: rtl ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  justifyContent:
                    this.state.loading || this.state.networkError
                      ? 'center'
                      : farArrow
                      ? 'space-between'
                      : center
                      ? 'center'
                      : 'flex-start',
                  flex: 1,
                  alignSelf: 'stretch',
                  padding: 0,
                },
              ]}
            >
              {leftItems.length && !this.props.icon ? (
                <AppView margin={1} padding={3} backgroundColor="transparent">
                  {leftItems.length &&
                    !this.state.loading &&
                    this.renderItems(leftItems)}
                </AppView>
              ) : leftItems.length && !this.state.loading ? (
                this.renderItems(leftItems)
              ) : null}
              {this.state.loading ? (
                <Indicator size={size} />
              ) : this.state.networkError ? (
                <View stretch center flex>
                  <Text size={size}>{I18n.t('ui-error')}</Text>
                </View>
              ) : (
                <React.Fragment>
                  {this.props.loadingIndicator ? (
                    <Indicator size={size} />
                  ) : (
                    <View stretch flex centerY={centerTextY} left={leftText}>
                      <Text
                        color={
                          this.state.label !== this.props.placeholder
                            ? '#6A6A6A'
                            : 'grey'
                        }
                        size={size}
                        mh={mh}
                        marginTop={
                          this.props.wellcomHeader
                            ? undefined
                            : this.props.contactUs &&
                              this.state.label !== this.props.placeholder
                            ? this.props.wellcomHeader
                              ? undefined
                              : 6
                            : 1
                        }
                      >
                        {this.state.label}
                      </Text>
                    </View>
                  )}
                  {/* <Icon
                  name="arrow-drop-down"
                  type="material"
                  size={size * 1.3}
                  color={color}
                /> */}
                </React.Fragment>
              )}
              {rightItems.length &&
              !this.props.icon &&
              !this.props.wellcomHeader ? (
                <AppView margin={4} padding={1.5} backgroundColor="transparent">
                  {rightItems.length &&
                    !this.state.loading &&
                    this.renderItems(rightItems)}
                </AppView>
              ) : rightItems.length && !this.state.loading ? (
                this.renderItems(rightItems)
              ) : null}
            </AppView>
          ) : (
            <ButtonContainer
              onPress={() => {
                // if (this.state.loading || this.state.networkError) return;
                if (this.props.addresses) {
                  AppNavigation.push({
                    name: 'appPickerModal',
                    passProps: {
                      hideSearch,
                      title,
                      searchTitle,
                      data: this.state.data,
                      iconType,
                      iconName,
                      label: this.state.label,
                      value: this.state.value,
                      addresses: this.props.addresses,
                      reload: this.reload,

                      onChange: v => {
                        this.onChange(v);
                      },
                      newSet: this.newSet,
                    },
                  });
                } else {
                  Navigation.showModal({
                    stack: {
                      children: [
                        {
                          component: {
                            name: 'appPickerModal',
                            passProps: {
                              hideSearch,
                              title,
                              searchTitle,
                              data: this.state.data,
                              iconType,
                              iconName,
                              label: this.state.label,
                              addresses: this.props.addresses,
                              onChange: v => {
                                this.onChange(v);
                              },
                            },
                          },
                        },
                      ],
                    },
                  });
                }
              }}
              style={[
                {
                  flexDirection: rtl ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  justifyContent:
                    this.state.loading || this.state.networkError
                      ? 'center'
                      : farArrow
                      ? 'space-between'
                      : center
                      ? 'center'
                      : 'flex-start',
                  flex: 1,
                  alignSelf: 'stretch',
                  padding: 0,
                },
              ]}
            >
              {leftItems.length && !this.props.icon ? (
                <AppView margin={1} padding={3} backgroundColor="transparent">
                  {leftItems.length &&
                    !this.state.loading &&
                    this.renderItems(leftItems)}
                </AppView>
              ) : leftItems.length && !this.state.loading ? (
                this.renderItems(leftItems)
              ) : null}

              {this.state.loading ? (
                <Indicator size={size} />
              ) : this.state.networkError ? (
                <View stretch center flex>
                  <Text size={size}>{I18n.t('ui-error')}</Text>
                </View>
              ) : (
                <React.Fragment>
                  {this.props.loadingIndicator ? (
                    <Indicator size={size} />
                  ) : (
                    <View stretch flex centerY={centerTextY} left={leftText}>
                      <Text
                        color={
                          this.state.label !== this.props.placeholder
                            ? '#6A6A6A'
                            : 'grey'
                        }
                        size={size}
                        mh={mh}
                        marginTop={
                          this.props.wellcomHeader
                            ? undefined
                            : this.props.contactUs &&
                              this.state.label !== this.props.placeholder
                            ? this.props.wellcomHeader
                              ? undefined
                              : 6
                            : 1
                        }
                      >
                        {this.state.label}
                      </Text>
                    </View>
                  )}
                  {/* <Icon
                  name="arrow-drop-down"
                  type="material"
                  size={size * 1.3}
                  color={color}
                /> */}
                </React.Fragment>
              )}
              {rightItems.length &&
              !this.props.icon &&
              !this.props.wellcomHeader ? (
                <AppView margin={4} padding={1.5} backgroundColor="transparent">
                  {rightItems.length &&
                    !this.state.loading &&
                    this.renderItems(rightItems)}
                </AppView>
              ) : rightItems.length && !this.state.loading ? (
                this.renderItems(rightItems)
              ) : null}
              {/* {rightItems.length && !this.state.loading
                ? this.renderItems(rightItems)
                : null} */}
            </ButtonContainer>
          )}
        </View>

        {!noValidation ? (
          <InputError
            error={this.state.isTouched ? error : ' '}
            size={size}
            errorTextMarginHorizontal={
              this.props.addresses ? this.props.errorTextMarginHorizontal : 5
            }
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(Picker);
