import React from "react";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
import { fetchTickets } from "../action/index";

import { FilterSelect } from "./FilterSelect";

import logo from "../img/logo.svg";
import turkishAirlines from "../img/turkish_airlines.svg";
import fly from "../img/fly_line.svg";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
      currencies: [],
      rate: 0,
      selected: "RUB"
    };
    this.handleChange = this.handleChange.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
  }

  componentDidMount() {
    this.props.fetchTickets();

    fetch("https://api.exchangeratesapi.io/latest?base=RUB&symbols=USD,EUR")
      .then(data => data.json())
      .then(data => {
        const currencies = [];
        currencies.push(
          data.base,
          ...Object.entries(data.rates).map(rates => rates[0])
        );

        this.setState({
          currencies,
          rate: data.rates
        });
      })
      .catch(err => console.log(err));
  }

  handleChange(event) {
    this.setState({
      selected: event.target.value
    });
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
    const { filter, rate, selected } = this.state;

    const filteredArray = tickets.filter(({ stops }) => {
      if (filter.stops) {
        return !filter.stops || stops === filter.stops;
      }
      return tickets;
    });

    return (
      <div className="homepage">
        <header className="homepage-header">
          <img src={logo} alt="logo" />
        </header>

        <section className="main">
          <div className="filter-block">
            <div className="filter-block-info">
              <p>ВАЛЮТА</p>

              <div className="radio-group">
                <input
                  type="radio"
                  value="RUB"
                  id="rub"
                  checked={selected === "RUB"}
                  onChange={this.handleChange}
                  className="stv-radio-button"
                />
                <label htmlFor="rub">RUB</label>

                <input
                  type="radio"
                  value="USD"
                  id="usd"
                  checked={selected === "USD"}
                  onChange={this.handleChange}
                  className="stv-radio-button"
                />
                <label htmlFor="usd">USD</label>

                <input
                  type="radio"
                  value="EUR"
                  id="eur"
                  checked={selected === "EUR"}
                  onChange={this.handleChange}
                  className="stv-radio-button"
                />
                <label htmlFor="eur">EUR</label>
              </div>

              <p>КОЛИЧЕСТВО ПЕРЕСАДОК</p>
              <FilterSelect
                options={[
                  { stops: 0 },
                  { stops: 1 },
                  { stops: 2 },
                  { stops: 3 }
                ]}
                parameter="stops"
                value={filter.stops}
                onChange={this.onChangeFilter}
              />
            </div>
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
              }, i ) => (
                <div key={i} className="result-block">
                  <div className="turkish-airlines">
                    <img
                      src={turkishAirlines}
                      alt="turkish-airlines"
                      className="turkish-airlines-img"
                    />
                    <button className="button-buy">
                      Купить <br /> за{" "}
                      {selected === "RUB"
                        ? price + " ₽"
                        : selected === "EUR"
                        ? Math.ceil(price * rate.EUR) + " €"
                        : Math.ceil(price * rate.USD) + " $"}
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
