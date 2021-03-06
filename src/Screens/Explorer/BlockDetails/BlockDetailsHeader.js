import React from 'react';

import { Card, CardBody, CardHeader } from 'reactstrap';
import Grid from '@material-ui/core/Grid';
import InfoIcon from '@material-ui/icons/Info';

import { map } from 'rxjs/operators';

import ObservableText from '../../../Components/ObservableText';

import Environment from '../../../Services/Environment';
import ObservableLink from '../../../Components/ObservableLink';

const BlockDetailsHeader = (props) =>{
  
  return (
    <Card>
      <CardHeader>
        CHC Block: <ObservableText value={props.block.pipe(map(block => block.hash))} />

        <ObservableLink value={props.block.pipe(map(block => Environment.blockchainApiUrl + "/getBlock?hash=" + block.hash))} >
          <InfoIcon style={{float:"right"}}/>
        </ObservableLink>

        
      </CardHeader>
      <CardBody>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={4} lg={2}>
            <div>
                Height
            </div>
            <div>
              <ObservableText value={props.block.pipe(map(block => block.height))} />
            </div>
          </Grid>
          <Grid item xs={12} sm={4} lg={2}>
            <div>
              Difficulty
            </div>
            <div>
              <ObservableText value={props.block.pipe(map(block => block.difficulty))} />
            </div>
          </Grid>

          <Grid item xs={12} sm={4} lg={2}>
            <div>
              Confirmations
            </div>
            <div>
              <ObservableText value={props.block.pipe(map(block => block.confirmations))} />
            </div>
          </Grid>

          <Grid item xs={12} sm={4} lg={2}>
            <div>
              Size (kB)
            </div>
            <div>
              <ObservableText value={props.block.pipe(map(block => block.size))} />
            </div>
          </Grid>

          <Grid item xs={12} sm={4} lg={2}>
            <div>
              Bits
            </div>
            <div>
              <ObservableText value={props.block.pipe(map(block => block.bits))} />
            </div>
          </Grid>

          <Grid item xs={12} sm={4} lg={2}>
            <div>
              Nonce
            </div>
            <div>
              <ObservableText value={props.block.pipe(map(block => block.nonce))} />
            </div>
          </Grid>

          <Grid item xs={12} sm={4} lg={2}>
            <div>
              Timestamp
            </div>
            <div>
              <ObservableText value={props.block.pipe(map(block => TimeToString(block.time)))} />
            </div>
          </Grid>
          
        </Grid>

      </CardBody>
    </Card>
  )
}

export default BlockDetailsHeader;





var TimeToString = (timestamp) =>{
  var d = new Date(timestamp * 1000);
  return d.toLocaleTimeString() + " " + d.toLocaleDateString();
}