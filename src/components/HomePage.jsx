import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { fetchTickets } from "../action/index";
import classNames from "classnames";

import logo from "../img/logo.svg";
import turkishAirlines from "../img/turkish_airlines.svg";
import fly from "../img/fly_line.svg";

export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      rate: 0,
      selected: "RUB",
      selectedStops: new Set(),
      checked: false,
      isAllchecked: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectedStops = this.handleSelectedStops.bind(this);
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

  handleSelectedStops(selecteStop, checked) {
    let selectedStops = this.state.selectedStops;
    if (checked) {
      selectedStops.add(selecteStop);
      this.setState({
        isAllchecked: false
      });
    } else {
      selectedStops.delete(selecteStop);
    }
    this.setState({ selectedStops });
  }

  removeSelected(event) {
    let selectedStops = this.state.selectedStops;
    selectedStops.clear();
    this.setState({
      isAllchecked: event.target.checked,
      checked: false,
      selectedStops
    });
  }

  renderList() {
    const items = this.props.tickets;
    const parameterArray = items.map(item => item.stops);
    const uniqueArray = [...new Set(parameterArray)];

    return uniqueArray.map(prop => {
      return (
        <li key={prop} id="wrapper">
          <input
            className="styled-checkbox"
            type="checkbox"
            name={prop}
            value={prop}
            checked={this.state.checked || this.state.selectedStops.has(prop)}
            onChange={event => {
              this.handleSelectedStops(prop, event.target.checked);
            }}
          />
          {prop === 0 ? (
            <label> Без пересадки</label>
          ) : prop === 1 ? (
            <label> {prop} пересадка</label>
          ) : (
            <label> {prop} пересадки</label>
          )}
          <p className="text">Только</p>
        </li>
      );
    });
  }

  render() {
    const { tickets, loading } = this.props;
    const { rate, selected, selectedStops } = this.state;

    console.log(loading);

    const newSelected = [...selectedStops];

    const filteredArray = (tickets, filter) => {
      if (selectedStops.size === 0) {
        return tickets;
      } else if (selectedStops.size !== 0) {
        const filteredStops = [];
        tickets.forEach(item => {
          if (newSelected.indexOf(item.stops) !== -1) {
            filteredStops.push(item);
          }
        });
        return filteredStops;
      }
    };

    const ticket = filteredArray(tickets, selectedStops);

    return (
      <div className="homepage">
        <header className="homepage-header">
          <img
            src={logo}
            alt="logo"
            className={classNames("preloader", loading ? "wait" : "")}
          />
        </header>

        {loading ? (
          ""
        ) : (
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
                  <li id="wrapper">
                    <input
                      className="styled-checkbox"
                      onChange={this.removeSelected.bind(this)}
                      checked={this.state.isAllchecked}
                      type="checkbox"
                      value="all"
                      name="checkAll"
                    />
                    <label>Все</label>
                    <p className="text">Только</p>
                  </li>

                  {this.renderList()}
                </ul>
              </div>
            </div>

            <div>
              {ticket.length > 0 &&
                ticket.map(
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
                )}
            </div>
          </section>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tickets: state.tickets.tickets,
  loading: state.tickets.loading
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
