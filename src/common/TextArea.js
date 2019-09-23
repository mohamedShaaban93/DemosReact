import React, { PureComponent } from 'react';
import { TextInput as NativeInput, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  BasePropTypes,
  dimensionsStyles,
  paddingStyles,
  fontSizeStyles,
  fontFamilyStyles,
  textDirectionStyles,
  colorStyles,
  borderStyles,
  borderRadiusStyles,
  backgroundColorStyles,
  elevationStyles,
} from './Base';
import { isASCII } from './utils/text';
import View from './View';
import InputError from './micro/InputError';
import { getTheme } from './Theme';
import { convertNumbers } from './utils/numbers';
import { AppView, AppText } from '.';
import {
  moderateScale,
  responsiveHeight,
  responsiveFontSize,
} from './utils/responsiveDimensions';

class TextArea extends PureComponent {
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
    error: PropTypes.string,
    noValidation: PropTypes.bool,
  };

  state = {
    isTouched: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset !== this.props.reset) {
      this.clear();
    }

    if (nextProps.error && !this.state.isTouched) {
      this.setState({
        isTouched: true,
      });
    }
  }

  static defaultProps = {
    ...getTheme().textArea,
  };

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.state = {
      text: props.initialValue,
    };
    this._animatedIsFocused = new Animated.Value(props.initialValue ? 1 : 0);
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.initialValue !== '' ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }

  onChangeText = (text, noValidate) => {
    const { name, onChange } = this.props;

    this.setState({
      text,
    });

    if (onChange) {
      if (name) onChange(name, text, !this.state.isTouched || noValidate);
      else onChange(text);
    }
  };

  onBlur = () => {
    const { name, onBlur } = this.props;

    if (onBlur) {
      if (name) onBlur(name, this.state.text);
      else onBlur(this.state.text);
    }
    this.setState({
      isFocused: false,
    });
  };

  onFocus = () => {
    const { onFocus, color, activeColor, initialValue } = this.props;

    if (onFocus) {
      onFocus(initialValue);
    }

    this.setState({
      isFocused: true,
      isTouched: true,
    });
  };

  onSubmitEditing = () => {
    const { name, onSubmitEditing } = this.props;

    if (onSubmitEditing) {
      if (name) onSubmitEditing(name, this.state.text);
      else onSubmitEditing(this.state.text);
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
    this.onChangeText('', true);
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
      return type ? 'grey' : '#FF0050';

    if (this.state.isFocused) {
      return 'primary';
    }
    return 'grey';
  };

  render() {
    const {
      placeholder,
      placeholderColor,
      rtl,
      translateNumbers,
      noValidation,
      error,
      size,
      flex,
      margin,
      marginHorizontal,
      marginVertical,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      underlineColor,
      maxLength,
      editable,
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
      borderRadius,
      noBorder,
      label,
      height,
      picker,
      paddingTop,
      style,
      borderTopColorContainer,
      borderTopWidthContainer,
      backgroundColor,
    } = this.props;

    const paddingText = moderateScale(2);
    const assignedColor = this.getColor();
    const labelStyle = [
      {
        position: 'absolute',
        top:
          this.state.text || this.state.isFocused
            ? responsiveHeight(22) / 4
            : responsiveHeight(height) / 7,
        // bottom: responsiveHeight(height) / 5,
        height: 20,
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignSelf: 'stretch',
        alignItems: rtl ? 'flex-end' : 'flex-start',
        paddingHorizontal: paddingText,
        transform: [
          {
            translateY: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -responsiveHeight(height) / 6],
            }),
          },
          {
            scale: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.8],
            }),
          },
          {
            translateX: this._animatedIsFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [
                0,
                rtl
                  ? responsiveFontSize(size) - 10
                  : -responsiveFontSize(size) + 10,
              ],
            }),
          },
        ],
      },
      !rtl ? { left: 0 } : { right: 0 },
    ];

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
        // style={[{ overflow: 'visible' }]}
        {...(this.state.isFocused && this.props.onFocusBorderHighlight
          ? this.props.onFocusBorderHighlight
          : null)}
      >
        <AppView
          stretch
          borderRadius={borderRadius}
          // borderWidth={borderWidth || (noBorder ? 0 : 1)}
          borderWidth={borderWidth || 0}
          borderTopWidth={borderTopWidth || borderTopWidthContainer}
          borderTopColor={borderTopColor || borderTopColorContainer}
          borderBottomWidth={
            this.state.isFocused || this.props.isTouched ? 1 : 0
          }
          borderLeftWidth={borderLeftWidth}
          borderRightWidth={borderRightWidth}
          borderBottomColor={borderBottomColor}
          borderLeftColor={borderLeftColor}
          borderRightColor={borderRightColor}
          borderColor={this.getColor() || borderColor}
          paddingTop={paddingTop}
          style={[
            { overflow: 'visible' },
            // colorStyles(this.props),
            // borderStyles(this.props),
            borderRadiusStyles(this.props),
            style,
          ]}
          backgroundColor={backgroundColor}

          // height={30}
        >
          {/* <AppView stretch flex> */}
          <NativeInput
            ref={this.inputRef}
            maxLength={maxLength}
            // {...rest}
            placeholder={convertNumbers(
              placeholder,
              translateNumbers ? rtl : false,
            )}
            placeholderTextColor={placeholderColor}
            multiline
            blurOnSubmit
            editable={editable}
            value={this.props.initialValue}
            underlineColorAndroid={underlineColor}
            onChangeText={this.onChangeText}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onSubmitEditing={this.onSubmitEditing}
            style={[
              dimensionsStyles(this.props),
              backgroundColorStyles(this.props),
              textDirectionStyles(this.props),
              fontSizeStyles(this.props),
              fontFamilyStyles(this.props),
              colorStyles(this.props),
              borderStyles(this.props),
              borderRadiusStyles(this.props),
              elevationStyles(this.props),
              {
                alignSelf: 'stretch',
                textAlignVertical: 'top',
                // margin: 10,
                padding: 0,
                borderTopWidth: undefined,
                borderBottomLeftRadius: undefined,
                borderBottomRightRadius: undefined,
                borderLeftWidth: undefined,
                borderRightWidth: undefined,
                // marginTop: 10,
                // marginHorizontal: 10,
                // marginHorizontal: 2,
                writingDirection: isASCII(this.state.text) ? 'ltr' : 'rtl',
              },
              paddingStyles(this.props),
            ]}
          />
          {label && (
            <Animated.View pointerEvents="none" style={labelStyle}>
              <AppText
                pointerEvents="none"
                color={
                  picker
                    ? 'grey'
                    : this.state.isFocused
                    ? 'primary'
                    : this.getColor('text')
                }
                size={size}
              >
                {label}
              </AppText>
            </Animated.View>
          )}
          {/* </AppView> */}
        </AppView>
        {!noValidation ? (
          <InputError
            textErrorHeight={
              this.props.textErrorHeight ? this.props.textErrorHeight : null
            }
            error={this.props.isTouched ? error : ''}
            size={size}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true },
)(TextArea);
