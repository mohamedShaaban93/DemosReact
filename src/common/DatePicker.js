import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import {
  BasePropTypes,
  paddingStyles,
  fontSizeStyles,
  fontFamilyStyles,
  textDirectionStyles,
  colorStyles,
} from './Base';

import View from './View';
import Icon from './Icon';
import Text from './Text';
import { getTheme } from './Theme';
import InputError from './micro/InputError';
import { convertNumbers } from './utils/numbers';

class DatePicker extends PureComponent {
  static propTypes = {
    // ...BasePropTypes,
    initialValue: PropTypes.string,
    name: PropTypes.string,
    // onChangeText: PropTypes.func,
    // onBlur: PropTypes.func,
    // onFocus: PropTypes.func,
    // onSubmitEditing: PropTypes.func,
    placeholder: PropTypes.string,
    placeholderColor: PropTypes.string,
    // secure: PropTypes.bool,
    leftItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    rightItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    // activeColor: PropTypes.string,
    // inactiveColor: PropTypes.string,
    color: PropTypes.string,
    error: PropTypes.string,
    // showSecureEye: PropTypes.bool,
    nextInput: PropTypes.objectOf(PropTypes.any),
    noValidation: PropTypes.bool,
  };

  static defaultProps = {
    leftItems: [],
    rightItems: [],
    ...getTheme().datePicker,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.state = {
      value: props.initialValue || props.placeholder,
      valueSet: !!props.initialValue,
      isDateTimePickerVisible: false,
      isTouched: false,
      // text: props.initialValue,
      // color: props.color || props.inactiveColor,
    };
  }

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = date => {
    const { name, onSelect } = this.props;

    this.setState({
      value: date,
      valueSet: true,
    });

    this.hideDateTimePicker();
    if (onSelect) {
      if (name) onSelect(name, date);
      else onSelect(date);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && !this.state.isTouched) {
      this.setState({
        isTouched: true,
      });
    }
  }

  getColor = () => {
    if (!this.state.isTouched || this.props.noValidation) {
      return '#8A8A8A';
    }
    if (this.props.error) return '#FF0050';
    return 'green';
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
          stretch: true,
          color: item.props.color || color,
          size: item.props.size || size * 1.5,
          backgroundColor: 'transparent',
          ph: item.props.ph || size / 1.5,
          pv: 0,
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
      size,
      color,
      placeholderColor,
      width,
      height,
      backgroundColor,
      borderRadius,
      elevation,
      rtl,
      nextInput,
      placeholder,
      translateNumbers,
      noValidation,
      error,
      flex,
      margin,
      marginHorizontal,
      marginVertical,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      borderWidth,
      borderTopWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderRightWidth,
      borderColor,
      borderTopColor,
      borderBottomColor,
      borderLeftColor,
      borderRightColor,
      padding,
      paddingVertical,
      paddingHorizontal,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      showDropArrow,
      ...rest
    } = this.props;

    let { leftItems, rightItems } = this.props;

    if (leftItems && !leftItems.map) leftItems = [leftItems];
    if (rightItems && !rightItems.map) rightItems = [rightItems];

    const assignedColor = this.getColor();
    return (
      <View
        stretch
        flex={flex}
        margin={margin}
        marginHorizontal={marginHorizontal}
        marginVertical={marginVertical}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
        width={width}
      >
        <View
          stretch
          row
          height={height}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          elevation={elevation}
          borderWidth={borderWidth}
          borderTopWidth={borderTopWidth}
          borderBottomWidth={borderBottomWidth}
          borderLeftWidth={borderLeftWidth}
          borderRightWidth={borderRightWidth}
          // borderColor={borderColor}

          borderColor={assignedColor}
          borderTopColor={borderTopColor}
          borderBottomColor={borderBottomColor}
          borderLeftColor={borderLeftColor}
          borderRightColor={borderRightColor}
        >
          {leftItems.length ? this.renderItems(leftItems) : null}

          <View
            flex
            stretch
            row
            onPress={this.showDateTimePicker}
            padding={padding}
            paddingVertical={paddingVertical}
            paddingHorizontal={paddingHorizontal}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
            paddingLeft={paddingLeft}
            paddingRight={paddingRight}
            spaceBetween={showDropArrow}
          >
            <Text color={color} size={size} mh={3}>
              {this.state.valueSet && this.props.momentFormat
                ? moment(this.state.value).format(this.props.momentFormat)
                : this.state.value.toString()}
            </Text>

            {showDropArrow ? (
              <Icon name="arrow-dropdown" color={color} size={size * 1.3} />
            ) : null}
          </View>
          {rightItems.length ? this.renderItems(rightItems) : null}
        </View>
        {!noValidation ? <InputError error={error} size={size} /> : null}

        <DateTimePicker
          {...rest}
          date={
            this.state.valueSet ? new Date(this.props.initialValue) : undefined
          }
          format="DD-MM-YYYY"
          {...(this.props.maxDate
            ? { maximumDate: new Date(this.props.maxDate) }
            : {})}
          {...(this.props.minDate
            ? { minimumDate: new Date(this.props.minDate) }
            : {})}
          // minimumDate={new Date(this.props.minDate)}
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(DatePicker);
