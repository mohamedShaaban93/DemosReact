import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
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
} from './Base';

class AppAnimatedText extends PureComponent {
  static propTypes = {
    ...BasePropTypes,
  };

  static defaultProps = {
    ...getTheme().text,
  };

  render() {
    const { rtl, children, style, translateNumbers, ...rest } = this.props;

    return (
      <Animated.text
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
          {
            textAlignVertical: 'center',
          },
          style,
        ]}
      >
        {convertNumbers(children, translateNumbers ? rtl : false)}
      </Animated.text>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(AppAnimatedText);
