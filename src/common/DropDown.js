import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, UIManager, findNodeHandle, Dimensions } from 'react-native';

import View from './View';
import Text from './Text';
import { responsiveWidth } from './utils/responsiveDimensions';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// TODO
class DropDown extends Component {
  // state = {
  //   visible: props
  // }

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      top: 0,
      left: 0,
    };
  }

  show = parent => {
    console.log(parent);

    UIManager.measureInWindow(
      findNodeHandle(parent),
      (ox, oy, containerWidth, containerHeight) => {
        // console.log(x);
        // console.log(y);
        // console.log(containerWidth);
        // console.log(containerHeight);

        // const width = 200;

        const dropdownOffset = {
          top: 52,
          left: 0,
        };

        const dropdownMargins = {
          min: 0,
          max: 0,
        };

        const minMargin = dropdownMargins.min;
        const maxMargin = dropdownMargins.max;

        // const dropdownOffset = {
        //   left: 0,
        //   top: 0,
        // };

        const itemCount = 4;
        const itemPadding = 8;

        let leftInset;
        const x = ox;

        if (this.props.rtl) {
          x -= screenWidth - (x + responsiveWidth(this.props.width));
        }

        let left = x + dropdownOffset.left - maxMargin;

        if (left > minMargin) {
          leftInset = maxMargin;
        } else {
          left = minMargin;
          leftInset = minMargin;
        }

        let right = x + containerWidth + maxMargin;
        let rightInset;

        if (screenWidth - right > minMargin) {
          rightInset = maxMargin;
        } else {
          right = screenWidth - minMargin;
          rightInset = minMargin;
        }

        // const top = y + dropdownOffset.top - itemPadding + containerHeight;
        const top = oy + dropdownOffset.top - itemPadding;

        console.log('XXX');
        console.log(x);
        console.log(right);
        console.log(containerWidth);

        this.setState({
          left,
          top,
        });
      },
    );

    this.setState({
      visible: true,
    });
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <Modal
        visible={this.state.visible}
        transparent
        onRequestClose={this.hide}
        onBackdropPress={this.hide}
      >
        <View
          elevation={3}
          width={this.props.width}
          height={20}
          backgroundColor="#ccc"
          bc="red"
          bw={2}
          style={{
            position: 'absolute',
            top: this.state.top,
            left: this.state.left,
            // width: this.width,
          }}
        />
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl,
});

export default connect(mapStateToProps, null, null,  {forwardRef:true})(
  DropDown,
);
