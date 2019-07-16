import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormGroup from '@material-ui/core/FormGroup';

import { TextValidator, ValidatorForm} from 'react-material-ui-form-validator';

import MyWalletServices from '../../Services/MyWalletServices';
import DialogService from '../../Services/DialogService';

export default (props) => {
  const [name, setName] = React.useState("");
  const [output, setOutput] = React.useState((props.output ||""));

  const form = React.useRef(null);


  React.useEffect(() => {

    ValidatorForm.addValidationRule('isChaincoinOutput', (output) => /^[a-fA-F0-9]{64}-[0-9]{1,8}$/.test(output));

  }, []);



  const handleAdd = () =>{ 
    form.current.isFormValid(false).then(valid =>{
      if (valid == false) return;

      MyWalletServices.addMyMasternode(name, output)
      .then(() => props.onClose())
      .catch(err => {
        DialogService.showMessage("Failed","Failed to add masternode")
      }); 
    });
  }


  

  return (
    <Dialog open={true} onClose={props.onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add Masternode</DialogTitle>
      <DialogContent>

        <ValidatorForm ref={form} >

          <FormGroup>
            <TextValidator
              label="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              validators={['required']}
              errorMessages={['required']}
            />
            <TextValidator
              label="Output"
              onChange={(e) => setOutput(e.target.value)}
              value={output}
              validators={['required', 'isChaincoinOutput']}
              errorMessages={['required',"Invalid"]}
            />
          </FormGroup>
        </ValidatorForm>

      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAdd} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}