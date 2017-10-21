import React, { Component } from "react";
import Order from "./Order";
import { connect } from "react-redux";
import store, { updateUser, fetchUserSession } from "../store";
import { mapOrderToProduct } from '../util/mapper'

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.currentUser,
      orders: props.orders,
      showSuccess: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Compare to currentUser updated in the store
    if (nextProps.currentUser !== this.props.currentUser) {
      this.setState({
        user: nextProps.currentUser
      });
    }
    if (nextProps.orders !== this.props.orders) {
      this.setState({
        orders: nextProps.orders
      });
    }
  }

  handleChange(e) {
    const update = {};
    update[e.target.name] = e.target.value;
    this.setState({
      user: { ...this.state.user, ...update },
      showSuccess: false
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    store.dispatch(this.props.updateUser(this.state.user)).then(() => {
      store.dispatch(fetchUserSession());
      this.setState({ showSuccess: true });
    });
  }

  render() {
    const { orders } = this.props;
    const { user } = this.state;
    const { handleChange, handleSubmit } = this;
    // loading state
    if (!user) return <h1>Loading...</h1>;

    return (
      <div>
        <h1>User Information</h1>
        <div className="row">
          <div className="col-xs-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h2>Account Info</h2>
              </div>
              <div className="panel-body">
                <img src={user.imgUrl} />
                <form onSubmit={handleSubmit} value={user.id}>
                  {[
                    "name",
                    "email",
                    "phone",
                    "Address",
                    "City",
                    "State",
                    "ZIP"
                  ].map(attr => {
                    return (
                      <div className="form-group" key={attr}>
                        <label>{`${attr[0].toUpperCase()}${attr.slice(
                          1
                        )}`}</label>
                        <input
                          type="text"
                          className="form-control"
                          name={attr}
                          value={user[attr]}
                          onChange={handleChange}
                        />
                      </div>
                    );
                  })}
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">
                      Update
                    </button>
                  </div>
                </form>
                {this.state.showSuccess && <strong>Change successful!</strong>}
              </div>
            </div>
          </div>
          <div className="col-xs-7">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h2>Order History</h2>
              </div>
              <div className="panel-body">
                { orders &&
                  orders.map(order => (<Order {...order} key={order.id} />))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    orders: state.orders.map(order => mapOrderToProduct(order, state.products))
  };
};

const mapDispatchToProps = { updateUser }

export default connect(mapStateToProps, mapDispatchToProps)(User);
