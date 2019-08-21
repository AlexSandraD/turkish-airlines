import React, { Component } from "react";

class InputTagCollection extends Component {
  render() {
    console.log(this.props.tags);
    const { price } = this.props.tags;
    return (
      <div id="chosen-tags">
        {gender.boy ? (
          <div
            className="collection"
            data-name="boy"
            onClick={e => this.props.allFilterClickListener(e, "gender")}
          >
            <h6 data-name="boy">BOY</h6>
          </div>
        ) : null}
        {gender.girl ? (
          <div
            className="collection"
            data-name="girl"
            onClick={e => this.props.allFilterClickListener(e, "gender")}
          >
            <h6 data-name="girl">GIRL</h6>
          </div>
        ) : null}
      </div>
    );
  }
}

export default InputTagCollection;
