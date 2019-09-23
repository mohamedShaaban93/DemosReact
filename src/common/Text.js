import React, { PureComponent } from 'react';
import { Text as NativeText } from 'react-native';
import { connect } from 'react-redux';

import { getTheme } from './Theme';
import { convertNumbers } from './utils/numbers';

import {
  BasePropTypes,
  fontSizeStyles,
  fontFamilyStyles,
  textDirectionStyles,
  colorStyles,
  backgroundColorStyles,
  borderStyles,
  borderRadiusStyles,
  paddingStyles,
  marginStyles,
  dimensionsStyles,
} from './Base';
import { responsiveFontSize } from './utils/responsiveDimensions';
import { isASCII } from './utils/text';

class Text extends PureComponent {
  static propTypes = {
    ...BasePropTypes,
  };

  static defaultProps = {
    ...getTheme().text,
  };

  render() {
    const { rtl, children, style, translateNumbers, ...rest } = this.props;

    return (
      <NativeText
        {...rest}
        style={[
          fontSizeStyles(this.props),
          fontFamilyStyles(this.props),
          textDirectionStyles(this.props),
          colorStyles(this.props),
          backgroundColorStyles(this.props),
          borderStyles(this.props),
          borderRadiusStyles(this.props),
          paddingStyles(this.props),
          marginStyles(this.props),
          dimensionsStyles(this.props),
          {
            textAlignVertical: 'center',
          },
          typeof children === 'string'
            ? {
                writingDirection: isASCII(children) ? 'ltr' : 'rtl',
              }
            : {},
          this.props.lineHeight
            ? {
                lineHeight: responsiveFontSize(this.props.lineHeight),
              }
            : {},
          style,
        ]}
      >
        {convertNumbers(children, translateNumbers ? rtl : false)}
      </NativeText>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(Text);
