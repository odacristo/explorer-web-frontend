import React from 'react';
import { combineLatest } from 'rxjs';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from "react-router-dom";


import MyWalletServices from '../Services/MyWalletServices';
import NotificationServices from '../Services/NotificationServices';


const styles = theme => ({
  root: {
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class AddressMenu extends React.Component {
  state = {
    menuAnchorEl: null,
    addToMyAddresses: true
  };

  subscription = null
 

  handleMenuClick = (event) =>{

    var menuAnchorEl = event.currentTarget;

    

    this.subscription = combineLatest(MyWalletServices.myAddresses, NotificationServices.addressSubscription(this.props.address)).subscribe(
      ([myAddresses, addressSubscription]) =>{
debugger;
        var myMn = myAddresses.find(myMn => {return myMn.address == this.props.address});

        this.setState({
          myMn,
          menuAnchorEl,
          addAddressSubscription: addressSubscription == false
        });
    });
  };

  handleMenuClose = () => {
    if (this.subscription != null) this.subscription.unsubscribe();
    this.setState({ menuAnchorEl: null });
  };

  
  handleMenuAddToMyAddresses = () => {
    this.handleMenuClose();
      var name = prompt("Please enter a name for the address");
      if (name == null) return;

      MyWalletServices.addMyAddress(name, this.props.address); //TODO: handle error
  };

  handleMenuRemoveFromMyAddresses = () => {
    this.handleMenuClose();

    if (window.confirm("Are you sure?") == false) return;
    MyWalletServices.deleteMyAddress(this.props.address); //TODO: handle error
  };


  handleMenuAddAddressSubscription = () => {
    this.handleMenuClose();
    NotificationServices.saveAddressSubscription(this.props.address); //TODO: handle error
  };

  handleMenuRemoveAddressSubscription = () => {
    this.handleMenuClose();
    NotificationServices.deleteAddressSubscription(this.props.address); //TODO: handle error
  };


  componentDidMount() {
  }

  componentWillUnmount = () => {
    if (this.subscription != null) this.subscription.unsubscribe();
  }



 
  render() {
    const { classes,address, hideViewAddress } = this.props;
    const { menuAnchorEl, myMn, addAddressSubscription } = this.state;

    

    return (
      <div className={classes.root}>
        <Button variant="contained" color="primary" aria-owns={menuAnchorEl ? 'simple-menu' : undefined} aria-haspopup="true" onClick={this.handleMenuClick}>
          Menu
        </Button>
        <Menu id="simple-menu" anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={this.handleMenuClose} >
          {
            hideViewAddress == true ?
            "" :
            <Link to={"/Explorer/Address/" + address}>
              <MenuItem  onClick={this.handleMenuClose}>View Address</MenuItem>
            </Link>
          }
          
        
          {
            myMn == null?
            <MenuItem onClick={this.handleMenuAddToMyAddresses}>Add to My Addresses</MenuItem> :
            <MenuItem onClick={this.handleMenuRemoveFromMyAddresses}>Remove from My Addresses</MenuItem>
          }
          {
            addAddressSubscription == true?
            <MenuItem onClick={this.handleMenuAddAddressSubscription}>Add Address Subscription</MenuItem> :
            <MenuItem onClick={this.handleMenuRemoveAddressSubscription}>Remove Address Subscription</MenuItem>
          }

          {this.props.children}
        </Menu>
      </div>
      
    );
  }
}


AddressMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired
};
export default withStyles(styles)(AddressMenu);




