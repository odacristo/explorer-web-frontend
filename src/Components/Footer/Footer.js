import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import MyAddresses from './MyAddresses'
import MyMasternodes from './MyMasternodes'
import Notifications from './Notifications'


const styles = {
  root: {
    "position": "fixed",
    "left": "0",
    "bottom": "0",
    "width": "100%",
    "background-color": "rgb(51, 51, 51)",
    "color": "white",
    "padding-top": "10px"
  },
  poweredBy:{
    "text-align":"center"
  },
  controls:{
    "float":"right"
  }
};

class ChaincoinExplorerFooter extends React.Component {
  constructor(props) {
    super(props);

  
  }



  render(){
    const { classes } = this.props;
    return (
    <div className={classes.root}>

      <Grid container >
        <Grid item sm={4} lg={4} className="hide-xs-down">

        </Grid>
        <Grid item xs={3} sm={3} lg={4} >
          <div className={classes.poweredBy}>
            Powered By Mcna
          </div>
        </Grid>
        <Grid item xs={9} sm={5} lg={4}>
          <span className={classes.controls}>
            <MyAddresses />
            <MyMasternodes />
            <Notifications />
          </span>
        </Grid>
      </Grid>

      
      

      
      
    </div>
      
    );
  }

 
  
}

ChaincoinExplorerFooter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChaincoinExplorerFooter);


