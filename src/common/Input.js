import React, { PureComponent } from "react";
import PropTypes from "prop-types";
// import I18n from "react-native-i18n";
import {
  TextInput as NativeInput,
  View as RNView,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import {
  BasePropTypes,
  paddingStyles,
  fontSizeStyles,
  fontFamilyStyles,
  textDirectionStyles,
  colorStyles,
  borderStyles
} from "./Base";

import { AppView, AppIcon, AppText, AppButton } from ".";
import { getTheme } from "./Theme";
import InputError from "./micro/InputError";
import { convertNumbers } from "./utils/numbers";
import { isASCII } from "./utils/text";
import {
  moderateScale,
  responsiveHeight,
  responsiveFontSize
} from "./utils/responsiveDimensions";
import Indicator from "./Indicator";
import colors from "./defaults/colors";

const Underline = ({ color, focused, error, isTouched }) => {
  const height = focused || (error && isTouched) ? 1 : 0;
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height,
        backgroundColor: color,
        // Underlines is thinner when input is not focused
        transform: [{ scaleY: focused ? 1 : 0.5 }]
      }}
    />
  );
};

class Input extends PureComponent {
  static propTypes = {
    ...BasePropTypes,
    initialValue: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    placeholder: PropTypes.string,
    placeholderColor: PropTypes.string,
    secure: PropTypes.bool,
    leftItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    rightItems: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
    activeColor: PropTypes.string,
    inactiveColor: PropTypes.string,
    color: PropTypes.string,
    error: PropTypes.string,
    showSecureEye: PropTypes.bool,
    nextInput: PropTypes.objectOf(PropTypes.any),
    noValidation: PropTypes.bool
    // asyncErrorResolver: PropTypes.func,
    // asyncDataResolver: PropTypes.func
  };

  static defaultProps = {
    leftItems: [],
    rightItems: [],
    masks: [],
    initialValue: "",
    ...getTheme().input,
    asyncLoading: false
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.state = {
      secure: props.secure,
      // text: props.initialValue,
      color: props.color || props.inactiveColor,
      isFocused: false
      // bol: false
      // isTouched: false,
      // asyncConnectionError: false
    };
    // this.asyncValidateLoading = false;
    this._animatedIsFocused = new Animated.Value(props.initialValue ? 1 : 0);
  }

  // setSyncLoading = asyncLoading => {
  //   this.setState({ asyncLoading });
  // };

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset !== this.props.reset) {
      this.clear();
    }
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.initialValue !== "" ? 1 : 0,
      duration: 150,
      useNativeDriver: true
    }).start();
  }

  // getText = () => this.state.text;

  // getTouchedStatus = () => this.state.isTouched;

  onChangeText = (text, noValidate) => {
    const { onChange } = this.props;

    this.setState({
      text
    });

    if (onChange) {
      onChange(text);
    }
  };

  onBlur = text => {
    const { name, onBlur, color, inactiveColor, initialValue } = this.props;

    if (!color) {
      this.setState({
        color: inactiveColor
      });
    }

    if (onBlur) {
      onBlur(text);
    }

    this.setState({
      isFocused: false
    });
  };

  onFocus = () => {
    const { onFocus, color, activeColor, initialValue } = this.props;

    if (!color) {
      this.setState({
        color: activeColor
      });
    }

    if (onFocus) {
      onFocus(initialValue);
    }

    this.setState({
      isFocused: true
    });
  };

  onSubmitEditing = () => {
    const { name, nextInput, onSubmitEditing, initialValue } = this.props;

    if (nextInput) {
      nextInput.current.focus();
    }

    if (onSubmitEditing) {
      if (name) onSubmitEditing(name, initialValue);
      else onSubmitEditing(initialValue);
    }
  };

  focus = () => {
    this.inputRef.current.focus();
  };

  blur = () => {
    this.inputRef.current.blur();
  };

  clear = () => {
    this.inputRef.current.clear();

    this.onChangeText("", true);
  };

  renderSecureEyeButton = () => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        this.setState(prevState => ({ secure: !prevState.secure }));
      }}
      style={{
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <RNView
        style={borderStyles({
          rtl: this.props.rtl,
          borderLeftColor: "#8A8A8A"
          // borderLeftWidth: 1,
        })}
      >
        <AppIcon
          size={8}
          paddingHorizontal={5}
          type="ion"
          name={
            this.state.secure
              ? Platform.select({
                  android: "md-eye-off",
                  ios: "ios-eye-off"
                })
              : Platform.select({
                  android: "md-eye",
                  ios: "ios-eye"
                })
          }
          color="#6A6A6A"
        />
      </RNView>
    </TouchableOpacity>
  );

  renderErrorIcon = () => (
    <AppIcon
      color="red"
      name="error-outline"
      type="material"
      onPress={this.focus}
      marginHorizontal={5}
      size={7}
    />
  );

  renderItems = items => {
    const { size } = this.props;

    const nodes = items.map(item => {
      if (
        item.type.WrappedComponent &&
        (item.type.WrappedComponent.displayName === "Button" ||
          item.type.WrappedComponent.displayName === "Icon")
      ) {
        return React.cloneElement(item, {
          key: String(Math.random()),
          transparent: true,
          stretch: item.type.WrappedComponent.displayName === "Button",
          color: item.props.color || this.state.color,
          size: item.props.size || size * 1.5,
          backgroundColor: "transparent",
          paddingHorizontal: item.props.paddingHorizontal || size / 1.5,
          paddingVertical: 0
        });
      }
      return React.cloneElement(item, {
        key: String(Math.random()),
        paddingHorizontal: item.props.paddingHorizontal || size / 1.5
      });
    });

    return nodes;
  };

  renderCover = () => (
    <TouchableWithoutFeedback
      onPress={() => {
        this.focus();
      }}
    >
      <RNView
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10
        }}
      />
    </TouchableWithoutFeedback>
  );

  getDistance = items => {
    let total = 0;
    const { size } = this.props;
    for (let i = 0; i < items.length; i++) {
      total +=
        (items[i].props.size || size) +
        (items[i].props.paddingHorizontal || size) +
        (items[i].props.marginHorizontal || 0);
    }
    return total * 2;
  };

  getColor = type => {
    if (this.props.borderColor) {
      return this.props.borderColor;
    }
    if (
      this.props.error &&
      !this.props.asyncLoading &&
      (this.props.isTouched || this.props.isFocused) &&
      !this.props.noValidation
    )
      return type ? colors.grey : "#FF0050";

    if (this.state.isFocused) {
      return colors.primary;
    }
    return colors.grey;
  };

  render() {
    const {
      size,
      secure,
      placeholderColor,
      width,
      height,
      backgroundColor,
      borderRadius,
      elevation,
      rtl,
      nextInput,
      showSecureEye,
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
      email,
      phone,
      number,
      label,
      errorTextMarginHorizontal,
      errorTextMarginBottom,
      noBorder,
      maxLength,
      style,
      editable,
      picker,
      ...rest
    } = this.props;

    let { leftItems, rightItems } = this.props;
    const paddingText = moderateScale(2);
    const assignedColor = this.getColor();
    const labelStyle = [
      {
        position: "absolute",
        top: responsiveHeight(height) / 5,
        bottom: responsiveHeight(height) / 5,
        borderRadius: moderateScale(10),
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: rtl ? "flex-end" : "flex-start",
        paddingHorizontal: paddingText,
        transform: [
          {
            translateY: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -responsiveHeight(height) / 4]
            })
          },
          {
            scale: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.9]
            })
          }
          // ,
          // {
          //   translateX: this._animatedIsFocused.interpolate({
          //     inputRange: [0, 1],
          //     outputRange: [
          //       0,
          //       rtl
          //         ? responsiveFontSize(size) - 15
          //         : -responsiveFontSize(size) + 15
          //     ]
          //   })
          // }
        ]
      },
      !rtl ? { left: 0 } : { right: 0 }
    ];

    if (leftItems && !leftItems.map) leftItems = [leftItems];
    if (rightItems && !rightItems.map) rightItems = [rightItems];

    let keyboardType = "default";
    if (number) keyboardType = "number-pad";
    if (phone) keyboardType = "phone-pad";
    if (email) keyboardType = "email-address";

    const scrollFixProps = {};

    if (Platform.OS === "android" && rtl && keyboardType === "default") {
      scrollFixProps.multiline = false;
      scrollFixProps.maxLength = maxLength || 10000;
    }

    return (
      <AppView
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
        <AppView
          style={{ overflow: "visible" }}
          stretch
          row
          height={height}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          elevation={elevation}
          // borderWidth={borderWidth || (noBorder ? 0 : 1)}
          borderWidth={borderWidth || 0}
          borderTopWidth={borderTopWidth}
          // borderBottomWidth={
          //   this.state.isFocused || (this.props.error && this.props.isTouched)
          //     ? 1
          //     : 0
          // }
          borderLeftWidth={borderLeftWidth}
          borderRightWidth={borderRightWidth}
          borderTopColor={borderTopColor}
          borderBottomColor={borderBottomColor}
          borderLeftColor={borderLeftColor}
          borderRightColor={borderRightColor}
          borderColor={this.getColor() || borderColor}
          style={[{ overflow: "visible" }, style]}
          {...(this.state.isFocused && this.props.onFocusBorderHighlight
            ? this.props.onFocusBorderHighlight
            : null)}
        >
          {leftItems.length ? this.renderItems(leftItems) : null}
          <AppView flex stretch>
            {label && (
              <Animated.View pointerEvents="none" style={labelStyle}>
                <AppText
                  pointerEvents="none"
                  color={picker ? "grey" : this.getColor("text")}
                  size={size - 0.5}
                >
                  {label}
                </AppText>
              </Animated.View>
            )}
            <NativeInput
              returnKeyType={nextInput ? "next" : "done"}
              {...rest}
              editable={editable}
              onChange={null}
              placeholder={convertNumbers(
                placeholder,
                translateNumbers ? rtl : false
              )}
              placeholderTextColor={placeholderColor}
              blurOnSubmit
              ref={this.inputRef}
              value={this.props.initialValue}
              underlineColorAndroid="transparent"
              secureTextEntry={this.state.secure}
              onChangeText={this.onChangeText}
              onBlur={this.onBlur}
              keyboardType={keyboardType}
              maxLength={maxLength}
              onFocus={this.onFocus}
              onSubmitEditing={this.onSubmitEditing}
              {...scrollFixProps}
              style={[
                textDirectionStyles(this.props),
                fontSizeStyles(this.props),
                fontFamilyStyles(this.props),
                colorStyles({ color: this.state.color }),
                {
                  flex: 1,
                  alignSelf: "stretch",
                  textAlignVertical: "bottom",
                  writingDirection: isASCII(this.props.initialValue)
                    ? "ltr"
                    : "rtl"
                },
                paddingStyles(this.props)
              ]}
            />
          </AppView>

          {this.props.asyncLoading && this.props.isTouched && (
            <Indicator color="primary" marginHorizontal={5} size={7} />
          )}

          {error &&
            this.props.isTouched &&
            !this.props.hideErrorIcon &&
            !this.props.asyncLoading &&
            this.renderErrorIcon()}

          {rightItems.length ? this.renderItems(rightItems) : null}
          {secure && showSecureEye
            ? this.renderItems([this.renderSecureEyeButton()])
            : null}

          <Underline
            error={this.props.error}
            isTouched={this.props.isTouched}
            color={this.getColor() || borderColor}
            focused={this.state.isFocused}
          />
        </AppView>

        <InputError
          error={
            !noValidation && !this.props.asyncLoading && this.props.isTouched
              ? error
              : " "
          }
          errorTextMarginHorizontal={errorTextMarginHorizontal}
          errorTextMarginBottom={errorTextMarginBottom}
          size={size}
        />
      </AppView>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(Input);
