import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import {
  Modal,
  View as RNView,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
  DatePickerIOS,
} from 'react-native';
import Animated from 'react-native-reanimated';

import moment from 'moment';
import { DatePicker as DatePickerAndroid } from 'react-native-wheel-datepicker';
import View from './View';
import Icon from './Icon';
import Text from './Text';
import Button from './Button';
import { getTheme } from './Theme';
import InputError from './micro/InputError';
import {
  responsiveHeight,
  windowHeight,
  windowWidth,
  screenHeight,
} from './utils/responsiveDimensions';

import { runTiming } from '../utils/animation';
import { AppView, AppText } from '.';

const DatePicker = Platform.OS === 'ios' ? DatePickerIOS : DatePickerAndroid;

const { Clock } = Animated;

const styles = StyleSheet.create({
  fullscreen: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: windowHeight,
    width: windowWidth,
  },
});

class WheelPicker extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderColor: PropTypes.string,
    leftItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    rightItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    color: PropTypes.string,
    error: PropTypes.string,
    nextInput: PropTypes.objectOf(PropTypes.any),
    noValidation: PropTypes.bool,
  };

  static defaultProps = {
    leftItems: [],
    rightItems: [],
    wheelsMarginHorizontal: 10,
    ...getTheme().wheelPicker,
  };

  constructor(props) {
    super(props);

    this.clock = new Clock();
    this.yPosition = runTiming(this.clock, screenHeight, 0, 300);

    this.date = new Date();
    this.state = {
      value: null,
      modalVisible: false,
      valueSet: false,
      isTouched: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && !this.state.isTouched) {
      this.setState({
        isTouched: true,
      });
    }
  }

  onPickerConfirm = () => {
    const { valueSet, value } = this.state;

    const { name, onChange } = this.props;
    let dateValue = value;

    dateValue = this.date;
    this.setState({
      modalVisible: false,
      valueSet: true,
      value: dateValue,
      isTouched: true,
    });

    if (onChange) {
      if (name) onChange(name, dateValue);
      else onChange(dateValue);
    }
  };

  show = () => {
    this.canChange = false;
    setTimeout(() => {
      this.canChange = true;
    }, 2000);
    this.setState({
      modalVisible: true,
    });
  };

  hide = () => {
    this.setState({
      modalVisible: false,
    });
  };

  renderStringFormat = () =>
    this.state.valueSet ? `${this.state.value}` : this.props.placeholder;

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

  onchangeData = value => {
    this.date = value;
  };

  getColor = () => {
    if (!this.state.isTouched || this.props.noValidation) {
      return '#8A8A8A';
    }
    if (this.props.error) return '#FF0050';
    return 'green';
  };

  renderHeaderAndroid = () => (
    <>
      <AppView flex center>
        <AppText>{I18n.t('minute')}</AppText>
      </AppView>
      <AppView flex center>
        <AppText>{I18n.t('hour')}</AppText>
      </AppView>
      <AppView flex center>
        <AppText>{I18n.t('year')}</AppText>
      </AppView>
      <AppView flex center>
        <AppText>{I18n.t('month')}</AppText>
      </AppView>
      <AppView flex center>
        <AppText>{I18n.t('day')}</AppText>
      </AppView>
    </>
  );

  renderHeaderIOS = () => (
    <>
      <AppView flex center>
        <AppText>{I18n.t('time')}</AppText>
      </AppView>
      <AppView flex center>
        <AppText>{I18n.t('date')}</AppText>
      </AppView>
    </>
  );

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
      wheelsMarginHorizontal,
      ...rest
    } = this.props;

    let { leftItems, rightItems } = this.props;

    const assignedColor = this.getColor();
    if (leftItems && !leftItems.map) leftItems = [leftItems];
    if (rightItems && !rightItems.map) rightItems = [rightItems];

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
          style={{
            overflow: 'visible',
          }}
          borderColor={assignedColor}
          borderTopColor={borderTopColor}
          borderBottomColor={borderBottomColor}
          borderLeftColor={borderLeftColor}
          borderRightColor={borderRightColor}
        >
          {this.state.valueSet && (
            <AppView
              marginHorizontal={4}
              paddingHorizontal={3}
              borderRadius={10}
              style={{
                position: 'absolute',
                top: -(responsiveHeight(3) / 2),
              }}
              height={3}
              center
              backgroundColor="white"
            >
              <Text color={assignedColor} size={0.8 * size}>
                {this.props.placeholder}
              </Text>
            </AppView>
          )}
          {leftItems.length ? this.renderItems(leftItems) : null}

          <View
            flex
            stretch
            row
            onPress={this.show}
            padding={padding}
            paddingVertical={paddingVertical}
            paddingHorizontal={paddingHorizontal}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
            paddingLeft={paddingLeft}
            paddingRight={paddingRight}
            spaceBetween={showDropArrow}
          >
            <Text color={assignedColor} size={size} mh={3}>
              {this.state.valueSet
                ? this.props.momentFormat
                  ? moment(this.state.value).format(this.props.momentFormat)
                  : this.renderStringFormat()
                : this.props.placeholder}
            </Text>

            {showDropArrow ? (
              <Icon name="arrow-dropdown" color={color} size={size * 1.3} />
            ) : null}
          </View>
          {rightItems.length ? this.renderItems(rightItems) : null}
        </View>

        <Modal
          hardwareAccelerated
          animationType="none"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.hide();
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this.hide();
            }}
          >
            <RNView
              style={[
                styles.fullscreen,
                {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  height: screenHeight,
                  justifyContent: 'flex-end',
                },
              ]}
            >
              <RNView
                style={{
                  backgroundColor: 'white',
                  width: windowWidth,
                  height: screenHeight - windowHeight,
                }}
              />
            </RNView>
          </TouchableWithoutFeedback>

          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.fullscreen,
              {
                justifyContent: 'flex-end',
                transform: [
                  {
                    translateY: this.yPosition,
                  },
                ],
              },
            ]}
          >
            <RNView
              style={{
                alignSelf: 'stretch',
                width: windowWidth,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                backgroundColor: 'white',
              }}
            >
              <View stretch row spaceBetween backgroundColor="#f3f3f3">
                {this.props.showClose ? (
                  <Button
                    transparent
                    touchableOpacity
                    leftIcon={
                      <Icon name="close" type="material" color="black" />
                    }
                    onPress={this.hide}
                  />
                ) : (
                  this.props.label && <Text> {this.props.label} </Text>
                )}
                <Button
                  title={I18n.t('ui-confirm')}
                  transparent
                  touchableOpacity
                  onPress={this.onPickerConfirm}
                />
              </View>
              <View
                stretch
                height={Platform.OS === 'ios' ? 0 : 5}
                row
                paddingHorizontal={wheelsMarginHorizontal}
                spaceBetween
              >
                {Platform.OS === 'ios' ? null : this.renderHeaderAndroid()}
              </View>
              <AppView stretch row paddingHorizontal={wheelsMarginHorizontal}>
                <DatePicker
                  selectedValue={this.state.value}
                  date={this.state.value || this.date}
                  minimumDate={new Date()}
                  style={
                    Platform.OS === 'ios'
                      ? {
                          flex: 1,
                          backgroundColor: 'white',
                        }
                      : {
                          backgroundColor: 'white',
                        }
                  }
                  onDateChange={this.onchangeData}
                  mode="datetime"
                  // locale={this.props.lang}
                  locale="en"
                  {...rest}
                />
              </AppView>
            </RNView>
          </Animated.View>
        </Modal>
        {!noValidation ? <InputError error={error} size={size} /> : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
  lang: state.lang.lang,
});

export default connect(mapStateToProps)(WheelPicker);
