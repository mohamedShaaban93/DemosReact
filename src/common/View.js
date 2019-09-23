import React, { PureComponent } from 'react';
import { View as RNView, TouchableOpacity } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import {
  BasePropTypes,
  dimensionsStyles,
  selfLayoutStyles,
  childrenLayoutStyles,
  backgroundColorStyles,
  elevationStyles,
  paddingStyles,
  marginStyles,
  borderStyles,
  borderRadiusStyles,
  overflowStyles,
} from './Base';

class View extends PureComponent {
  static propTypes = {
    ...BasePropTypes,
  };

  render() {
    const {
      onLayout,
      style,
      onPress,
      touchableOpacity,
      children,
      width,
      height,
      equalSize,
      circleRadius,
      flex,
      flexInnerTouchable,
      stretch,
      stretchInnerTouchable,
      linearBackgroundGradient,
    } = this.props;

    const Container = touchableOpacity ? TouchableOpacity : RectButton;

    const node = onPress ? (
      <Container
        // borderless={!linearBackgroundGradient}
        onPress={onPress}
        style={[
          childrenLayoutStyles(this.props),
          overflowStyles(this.props),
          paddingStyles(this.props),
          {
            flex:
              flex || flexInnerTouchable || height || equalSize || circleRadius
                ? 1
                : null,
            alignSelf:
              stretch ||
              stretchInnerTouchable ||
              width ||
              equalSize ||
              circleRadius
                ? 'stretch'
                : null,
          },
        ]}
      >
        {children}
      </Container>
    ) : (
      children
    );

    const ViewContainer = linearBackgroundGradient ? LinearGradient : RNView;

    return (
      <ViewContainer
        onLayout={onLayout}
        {...linearBackgroundGradient || {}}
        style={[
          dimensionsStyles(this.props),
          selfLayoutStyles(this.props),
          !onPress ? childrenLayoutStyles(this.props) : undefined,
          backgroundColorStyles(this.props),
          overflowStyles(this.props),
          elevationStyles(this.props),
          !onPress ? paddingStyles(this.props) : undefined,
          marginStyles(this.props),
          borderStyles(this.props),
          borderRadiusStyles(this.props),
          style,
        ]}
      >
        {node}
      </ViewContainer>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps)(View);
