import React from 'react';
import classNames from 'classnames';

const stoped = {
  0 : 'Без пересадок',
  1 : '1 пересадка',
  2 : '2 пересадки ',
  3 : '3 пересадки ',
};

export class FilterSelect extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      active: false,
    }
  }

  toggleActive = () => {
    this.setState({ active: !this.state.active })
  };

  setValue = prop => {
    this.props.onChange(this.props.parameter, prop)
    this.setState({active: !this.state.active })
  };

  render() {
    const { parameter, options } = this.props;
    const parameterArray = options.map(option => option[parameter])
    const uniqueArray = [...new Set(parameterArray)]

    return (
      <div onClick={this.toggleActive} className={classNames('select', this.state.active ? ' select-active' : ' select-deactive', typeof this.props.value !== 'undefined' && this.props.value !== null && this.props.value.length ? ' selected' : '')}>
        <div className='select__options'>
          {uniqueArray.length > 0 && uniqueArray.map((prop, i) => {
            let value;
            if(parameter === 'stops') {
              value = stoped[prop];
            } else { value = prop || 'Все' }

            return (
              <div key={`filter-value-${i}`} onClick={() => this.setValue(prop)} className={classNames('select__option')}>
                {value}
              </div>
            )
          })}
        </div>
        <div className='select__trigger' onClick={this.toggleActive}>
        </div>
      </div>
    )
  }
}