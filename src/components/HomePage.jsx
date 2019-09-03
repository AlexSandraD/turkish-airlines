import React from "react";
import { bindActionCreators } from "redux";

import { connect } from "react-redux";
import { fetchTickets, addFilter, removeFilter } from "../action/index";

import logo from "../img/logo.svg";
import turkishAirlines from "../img/turkish_airlines.svg";
import fly from "../img/fly_line.svg";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      rate: 0,
      selected: "RUB"
    };
    this.handleChange = this.handleChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
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

  onCheckboxChange(e) {
    const filterType = e.target.value;
    if (e.target.checked) {
      this.props.addFilter(filterType);
    } else {
      this.props.removeFilter(filterType);
    }
  }

  render() {
    const { tickets, filter } = this.props;
    const { types, rate, selected } = this.state;

    const filteredArray = (tickets, filter) => {
      if (filter.length === 0) {
        return tickets;
      } else if (filter.length !== 0) {
        const filteredStops = [];
        tickets.forEach(item => {
          if (filter.indexOf(item.stops.toString()) !== -1) {
            filteredStops.push(item);
          }
        });
        return filteredStops;
      }
    };

    const ticket = filteredArray(tickets, filter);

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

              <ul className="filter-select">
                <li>
                  <input id="stop" type="checkbox" value="all" />
                  <label htmlFor="stop">Все</label>
                </li>
                <li>
                  <input
                    id="stop1"
                    type="checkbox"
                    value="1"
                    onChange={e => this.onCheckboxChange(e)}
                  />
                  <label htmlFor="stop1">1 пересадка</label>
                </li>
                <li>
                  <input
                    id="stop2"
                    type="checkbox"
                    value="2"
                    onChange={e => this.onCheckboxChange(e)}
                  />
                  <label htmlFor="stop2">2 пересадки</label>
                </li>
                <li>
                  <input
                    id="stop3"
                    type="checkbox"
                    value="3"
                    onChange={e => this.onCheckboxChange(e)}
                  />
                  <label htmlFor="stop3">3 пересадки</label>
                </li>
                <li>
                  <input
                    id="stop0"
                    type="checkbox"
                    value="0"
                    onChange={e => this.onCheckboxChange(e)}
                  />
                  <label htmlFor="stop0">Без пересадок</label>
                </li>
              </ul>
            </div>
          </div>

          <div>
            {ticket.length > 0 &&
              ticket
                // .filter(item => item.stops === !types[item.stops])
                .map(
                  (
                    {
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
                    },
                    i
                  ) => (
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
                )
            // : ""
            }
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets.tickets,
  filter: state.filter.filter
  // loading: state.tickets.loading,
  // error: state.tickets.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTickets,
      addFilter,
      removeFilter
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
