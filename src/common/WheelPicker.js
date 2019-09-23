import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'react-native-i18n';
import {
  Modal,
  View as RNView,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { WheelPicker as RNWheelPicker } from 'react-native-wheel-picker-android';
import Animated from 'react-native-reanimated';

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
    initialValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
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
    initialValue: [],
    wheels: [],
    wheelsMarginHorizontal: 10,
    ...getTheme().wheelPicker,
  };

  constructor(props) {
    super(props);

    this.clock = new Clock();
    this.yPosition = runTiming(this.clock, screenHeight, 0, 300);

    const wheels = props.wheels.map((wheel, index) => {
      const data = wheel.data || [];
      const maskData = wheel.maskData || data;
      const vIndex = data.findIndex(v => v == props.initialValue[index]);
      const selectedValue = props.initialValue[index] || '';

      return {
        ...wheel,
        data,
        maskData,
        id: index,
        selectedIndex: vIndex === -1 ? 0 : vIndex,
        selectedValue,
      };
    });

    this.state = {
      value: props.initialValue,
      wheels,
      modalVisible: false,
      valueSet: props.initialValue.length,
    };
  }

  onPickerConfirm = () => {
    // const valueSet = this.state.wheels.some(w => w.selectedValue);
    // if (!valueSet) {
    //   this.setState({
    //     modalVisible: false,
    //   });
    //   return;
    // }

    const { name, onChange } = this.props;

    const v = this.state.wheels.map(w => w.selectedValue || w.data[0]);

    this.setState({
      value: v,
      valueSet: true,
      modalVisible: false,
    });

    if (onChange) {
      if (name) onChange(name, v);
      else onChange(v);
    }
  };

  show = () => {
    this.setState({
      modalVisible: true,
    });
  };

  hide = () => {
    const wheels = this.state.wheels.map((wheel, index) => {
      const vIndex = wheel.data.findIndex(v => v == this.state.value[index]);
      return {
        ...wheel,
        selectedValue: this.state.value[index],
        selectedIndex: vIndex,
      };
    });

    this.setState({
      modalVisible: false,
      wheels,
    });
  };

  renderStringFormat = () =>
    this.state.valueSet
      ? `${this.displayWheelValue(0)} ${this.displayWheelValue(1)}`
      : this.props.placeholder;

  displayWheelValue = wheelIndex => {
    const wheel = this.state.wheels[wheelIndex];
    const vIndex = wheel.data.findIndex(v => v == this.state.value[wheelIndex]);

    return wheel.maskData[vIndex];
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
      wheelsMarginHorizontal,
      ...rest
    } = this.props;

    let { leftItems, rightItems } = this.props;

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
          borderColor={borderColor}
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
            <Text
              color={this.state.value.length ? color : placeholderColor}
              size={size}
              mh={3}
            >
              {this.renderStringFormat()}
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
                backgroundColor="white"
                stretch
                paddingTop={5}
                row
                paddingHorizontal={wheelsMarginHorizontal}
              >
                {this.state.wheels.map(w => (
                  <RNWheelPicker
                    hideIndicator
                    key={String(w.id)}
                    selectedItem={w.selectedIndex}
                    data={w.maskData}
                    onItemSelected={index => {
                      const wheelIndex = this.state.wheels.findIndex(
                        i => i.id === w.id,
                      );

                      const wheels = [
                        ...this.state.wheels.slice(0, wheelIndex),
                        {
                          ...this.state.wheels[wheelIndex],
                          selectedValue: this.state.wheels[wheelIndex].data[
                            index
                          ],
                          selectedIndex: index,
                        },
                        ...this.state.wheels.slice(wheelIndex + 1),
                      ];

                      this.setState({
                        wheels,
                      });
                    }}
                    style={{
                      width: `${100 / this.state.wheels.length}%`,
                      height: Dimensions.get('window').height * 0.2,
                    }}
                  />
                ))}
              </View>
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
});

export default connect(mapStateToProps)(WheelPicker);
