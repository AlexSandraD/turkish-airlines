import React from "react";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
import { fetchTickets } from "../action/index";

import { FilterSelect } from "./FilterSelect";

import logo from "../img/logo.svg";
import turkishAirlines from "../img/turkish_airlines.svg";
import fly from "../img/fly_line.svg";

const stoped = {
  "0": "Без пересадок",
  "1": "1 пересадка",
  "2": "2 пересадки ",
  "3": "3 пересадки "
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
      currencies: [],
      value: "?",
      base: "?",
      input: "?",
      rate: 0
    };
    this.getRates = this.getRates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
  }

  componentDidMount() {
    this.props.fetchTickets();

    fetch("https://api.exchangeratesapi.io/latest?symbols=USD")
      .then(data => data.json())
      .then(data => {
        const currencies = [];
        currencies.push(
          data.base,
          ...Object.entries(data.rates).map(rates => rates[0])
        );

        this.setState({
          currencies
        });
        console.log(data);
      })
      .catch(err => console.log(err));

    // fetch('https://api.exchangeratesapi.io/latest')
    // .then(data => data.json())
    // .then(data => {
    //   const currencies = [];
    //   currencies.push(data.base, ...Object.entries(data.rates).map(rates => rates[0]));
    //   currencies.sort();
    //   this.setState( { currencies } );
    //   console.log(data);
    // })
    // .catch(err => console.log(err));
  }

  getRates() {
    const base = this.handlePrint();
    console.log(this.state);
    fetch(`https://exchangeratesapi.io/api/latest?base=${base}`)
      .then(data => data.json())
      .then(data => {
        this.setState({
          rate: data.rates
        });
        console.log(data.rates);
      })
      .catch(err => console.log(err));
  }

  DropDown = function(list) {
    return <option value={list}>{list}</option>;
  };

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handlePrint() {
    console.log(this.state);
    if (this.state.value) {
      return this.state.value;
    }
  }

  onChangeFilter(parameter, value) {
    this.setState({
      filter: {
        ...this.state.filter,
        [parameter]: value
      }
    });
  }

  render() {
    const { tickets } = this.props;
    const { filter, currencies } = this.state;

    const filteredArray = tickets.filter(({ stops }) => {
      if (filter.stops) {
        return !filter.stops || stops === filter.stops;
      }
      return tickets;
    });

    // console.log(filter.stops);

    return (
      <div className="homepage">
        <header className="homepage-header">
          <img src={logo} alt="logo" />
        </header>

        <section className="main">
          <div className="filter-block">
            <p>ВАЛЮТА</p>


            <div>
              <span>SELECT your Base: </span>
              <select autoFocus onChange={this.handleChange}>
                <option inputcurrency={currencies} selected data-default>
                  SELECT BASE
                </option>
                {currencies.map(this.DropDown)}
              </select>
              <button onClick={this.getRates}>GET RAtes</button>
              <p>selected base:{this.handlePrint()} </p>
            </div>



            <p>КОЛИЧЕСТВО ПЕРЕСАДОК</p>
            <FilterSelect
              options={[{ stops: 0 }, { stops: 1 }, { stops: 2 }, { stops: 3 }]}
              // label="Статус"
              parameter="stops"
              value={filter.stops}
              onChange={this.onChangeFilter}
            />
          </div>

          <div>
            {filteredArray.map(
              ({
                origin,
                origin_name,
                destination,
                destination_name,
                departure_time,
                arrival_time,
                departure_date,
                arrival_date,
                stops,
                price
              }) => (
                <div className="result-block">
                  <div className="turkish-airlines">
                    <img
                      src={turkishAirlines}
                      alt="turkish-airlines"
                      className="turkish-airlines-img"
                    />
                    <button className="button-buy">
                      Купить <br /> за {price}
                    </button>
                  </div>
                  <div className="turkish-airlines-info">
                    <div className="info-first">
                      <p className="info-time">{departure_time}</p>
                      <div className="div-stops">
                        {stops === 0 ? (
                          ""
                        ) : (
                          <div className="info-stops">
                            <p className="text-light">{stops}</p>
                            <p className="text-light">
                              {stops === 1 ? "ПЕРЕСАДКА" : "ПЕРЕСАДКИ"}
                            </p>
                          </div>
                        )}
                        <img src={fly} alt="fly" />
                      </div>
                      <p className="info-time">{arrival_time}</p>
                    </div>
                    <div className="info-second">
                      <div className="info-origin">
                        <p className="text-dark">
                          {origin}, {origin_name}
                        </p>
                        <p className="text-light">{departure_date}, Пт</p>
                      </div>
                      <div className="info-origin">
                        <p className="text-dark">
                          {destination_name}, {destination}
                        </p>
                        <p className="text-light">{arrival_date}, Пт</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets.tickets
  // loading: state.tickets.loading,
  // error: state.tickets.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTickets
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
