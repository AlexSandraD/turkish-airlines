import React from "react";

export class FilterSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // active: 'all'
    };
  }

  handleChange = stop => this.props.onChange(stop);

  render() {
    const { tickets } = this.props;

    const stopArray = ['all'];
    tickets.map(item => {
      if (stopArray.indexOf(item.stops) < 0) {
        return stopArray.push(item.stops);
      }
      return tickets;
    });

    return (
      <div>
        <p>КОЛИЧЕСТВО ПЕРЕСАДОК</p>
        {stopArray.map(stop => (
          <div key={stop} onClick={() => this.handleChange(stop)}>
            {stop}
          </div>
        ))}
      </div>
    );
  }
}
