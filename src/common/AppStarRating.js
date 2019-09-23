import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Colors from "./defaults/colors";
import View from "./View";
import Icon from "./Icon";

class AppStarRating extends Component {
  static propTypes = {
    size: PropTypes.number,
    rate: PropTypes.number,
    maxStars: PropTypes.number
  };

  static defaultProps = {
    size: 8,
    maxStars: 5,
    disabled: true,
    rate: 0,
    emptyStar: "star-o",
    emptyStarColor: "gray",
    fullStar: "star",
    fullStarColor: Colors.star,
    halfStar: "star-half-empty",
    halfStarColor: Colors.star,
    iconSet: "font-awesome"
  };

  constructor(props) {
    super(props);

    this.state = {
      rating: props.rate
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rate !== this.props.rate) {
      this.setState({
        rating: nextProps.rate
      });
    }
  }

  onPress = r => {
    this.setState({
      rating: r
    });

    if (this.props.selectedStar) {
      this.props.selectedStar(r);
    }
  };

  renderStars = () => {
    const {
      emptyStar,
      emptyStarColor,
      fullStar,
      fullStarColor,
      halfStar,
      halfStarColor,
      iconSet,
      size,
      starPaddingHorizontal,
      disabled,
      maxStars,
      starStyle
    } = this.props;

    const nodes = [];

    let starsLeft = Math.round(this.state.rating * 2) / 2;

    for (let i = 0; i < maxStars; i++) {
      let starIconName = emptyStar;
      let starIconColor = emptyStarColor;
      let flip = false;

      if (starsLeft >= 1) {
        starIconName = fullStar;
        starIconColor = fullStarColor;
      } else if (starsLeft === 0.5) {
        starIconName = halfStar;
        starIconColor = halfStarColor;
        flip = this.props.rtl;
      }

      nodes.push(
        <View
          key={i}
          touchableOpacity
          onPress={
            disabled
              ? null
              : () => {
                  this.onPress(i + 1);
                }
          }
          style={{
            paddingHorizontal: starPaddingHorizontal || 0
          }}
        >
          <Icon
            name={starIconName}
            type={iconSet}
            color={starIconColor}
            size={size}
            flip={flip}
            style={starStyle}
          />
        </View>
      );

      starsLeft -= 1;
    }

    return nodes;
  };

  render() {
    const { containerStyle, ...rest } = this.props;

    return (
      <View row {...rest} style={containerStyle}>
        {this.renderStars()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  rtl: state.lang.rtl
});

export default connect(mapStateToProps)(AppStarRating);
