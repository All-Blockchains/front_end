import React from 'react';
import Utils from '../../utils/index';
import Swal from 'sweetalert2';
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Save from '@material-ui/icons/Save'
import classNames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning'
import LinkIcon from '@material-ui/icons/Link'
import BlurIcon from '@material-ui/icons/BlurOn'
import '../App/App.scss';
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextFormatIcon from '@material-ui/icons/TextFormat'
import {DONT_ADDRESS} from "../../utils/constants"

const styles = theme => ({

    root: {
        flexGrow: 1,
    },

    button: {
        margin: theme.spacing.unit,
    },

    leftIcon: {
        marginRight: theme.spacing.unit,
    },

    rightIcon: {
        marginLeft: theme.spacing.unit,
    },

    iconSmall: {
        fontSize: 20,
    },

});

const theme = createMuiTheme({
    palette: {

        primary: green,
    },
    typography: {useNextVariants: true},
});


class BitcoinTdns extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            tronWeb: {
                installed: false,
                loggedIn: false
            },


            errorName: false,
            errorAddress: false,
            errorHashId: false,
            isAddressNameFree: true,
            loadingName: true,
            isHashIdValid: false,
            isValid: false,
            isPaid: false,

            address: '',
            addressName: '',
            hashId: '',
            helperTextForHashId: 'hash id is required ',
            helperTextForName: 'address name is required',
            helperTextForAddress: 'a valid address is required',

        };


    }

    async componentDidMount() {

        // await new Promise(resolve => {
        //     const tronWebState = {
        //         installed: !!window.tronWeb,
        //         loggedIn: window.tronWeb && window.tronWeb.ready
        //     };
        //
        //     if (tronWebState.installed) {
        //         this.setState({
        //             tronWeb:
        //             tronWebState
        //         });
        //
        //         return resolve();
        //     }
        //
        //     let tries = 0;
        //
        //     const timer = setInterval(() => {
        //         if (tries >= 10) {
        //
        //             //const TRONGRID_API = 'https://api.shasta.trongrid.io';
        //
        //             window.TronWeb = new TronWeb(
        //                 TRON_API,
        //                 TRON_API,
        //                 TRON_API
        //             );
        //
        //             this.setState({
        //                 tronWeb: {
        //                     installed: false,
        //                     loggedIn: false
        //                 }
        //             });
        //
        //             clearInterval(timer);
        //             return resolve();
        //         }
        //
        //         tronWebState.installed = !!window.tronWeb;
        //         tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;
        //
        //         if (!tronWebState.installed)
        //             return tries++;
        //
        //         this.setState({
        //             tronWeb: tronWebState
        //         });
        //
        //         resolve();
        //     }, 100);
        // });
        //
        // if (!this.state.tronWeb.loggedIn) {
        //     // Set default address (foundation address) used for contract calls
        //     // Directly overwrites the address object as TronLink disabled the
        //     // function call
        //     window.tronWeb.defaultAddress = {
        //         hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
        //         base58: FOUNDATION_ADDRESS
        //     };
        //
        //     window.tronWeb.on('addressChanged', () => {
        //         if (this.state.tronWeb.loggedIn)
        //             return;
        //
        //         this.setState({
        //             tronWeb: {
        //                 installed: true,
        //                 loggedIn: true
        //             }
        //         });
        //     });
        // }
        //
        // Utils.setTronWeb(window.tronWeb);

    }


    validation = async () => {


        if (await !this.state.errorName && this.state.addressName !== "") {

            if (this.state.address.length === 34) {

                return true;
            }


        }

        return false;


    };

    handlerChange = async event => {


        switch (event.target.name) {


            case 'addressName' :

                this.setState({addressName: event.target.value});


                if (event.target.value !== "") {

                    // this.setState({ errorName: false, helperTextForName: ''});

                    this.setState({addressName: event.target.value.trim()});
                    this.setState({loadingName: true});

                    const x = await this.getAddress(event.target.value.toString().trim());

                    this.setState({loadingName: false});


                    if (x !== DONT_ADDRESS) {

                        this.setState({errorName: true, isAddressNameFree: false, helperTextForName: 'already taken '});

                    } else if (this.state.addressName === "") {

                        this.setState({errorName: false, helperTextForName: 'Name is required '});

                    } else {

                        //this.setState({isAddressNameFree: true, helperTextForName: '' , errorName: false});
                        this.setState({isAddressNameFree: true, errorName: false, helperTextForName: 'Name is  free '});

                    }

                } else {

                    this.setState({errorName: true, helperTextForName: 'Name is required '})
                }

                break;


            case 'address' :


                this.setState({'address': event.target.value});


                //&& event.target.value !== "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"
                if ((event.target.value.length === 34 || event.target.value.length === 0)) {

                    this.setState({errorAddress: false, helperTextForAddress: ''});


                } else {

                    this.setState({errorAddress: true, helperTextForAddress: 'Invalid Tron Address'})

                }


                break;


            default :
                break;

        }

        this.validation();
    };

    handlerClick = event => {


        switch (event.target.name) {

            case 'customInput' :
                break;

            case 'tdnsSend':
                const {addressName} = this.state.addressName;

                const x = this.getAddress(addressName);


                break;
            default :

                return;
        }


    };


    async getAddress(name) {


        return await Utils.fetchAddress(name);
        // const x = await Utils.contract.getWallet("a").call() ;

    }


    stateOfAddressNameTextField = () => {

        if (this.state.addressName.length === 0) {


            return <TextFormatIcon/>;


        } else {

            if (this.state.loadingName) {

                return <CircularProgress size={26}/>

            }
            return (this.state.isAddressNameFree ? <CheckIcon color="primary"/> : <WarningIcon color="error"/>);

        }

    };

    stateOfAddressTextField = () => {

        if (this.state.address.length !== 34) {


            return (!this.state.errorAddress ? <LinkIcon color="action"/> : <WarningIcon color="error"/>)

        } else {


            // return (!this.state.errorAddress ? <CheckIcon color="primary"/> : <WarningIcon color="error"/>);

            return <CheckIcon color="primary"/>
        }

    };

    stateOfHashIdTextField = () => {

        if (this.state.address.length !== 64) {


            return (!this.state.errorHashId ? <BlurIcon color="action"/> : <WarningIcon color="error"/>)

        } else {


            // return (!this.state.errorAddress ? <CheckIcon color="primary"/> : <WarningIcon color="error"/>);

            return <CheckIcon color="primary"/>
        }

    };


    addTNS = async () => {

        const {addressName, address} = this.state;

        //   console.log(addressName, address);

        Utils.contract.addWallet(addressName.trim(), address.trim()).send().then(async res => {

            const {data} = await Utils.getData(res);

            setTimeout(() => {

                if (data.result === "FAILED") {
                    Swal({
                        title: 'Wrong Name ',
                        type: 'error'
                    })
                } else {
                    Swal({
                        title: 'Added Address',
                        type: 'success'
                    })
                }

            }, 1000)


        }).catch(err => {

            console.log(err);

        }).then(() => {

        });


    };


    renderWalletInfo() {

        const {isValid} = this.state;

        const {classes} = this.props;

        // if (!this.state.tronWeb.installed)
        //     return <TronLinkGuide/>;
        //
        //
        // if (!this.state.tronWeb.loggedIn)
        //     return <TronLinkGuide installed/>;

        return (

            <div className={'messageInput'}>


                <MuiThemeProvider theme={theme}>

                    <div className="container">

                        <div className="row">

                            <div className="col-md-4 col-sm-6">

                                <TextField
                                    className="m-2"
                                    label="Name "
                                    name="addressName"
                                    variant="outlined"
                                    placeholder="Example: JustingSun.tron"
                                    required
                                    id="addressName"
                                    fullWidth
                                    onChange={this.handlerChange}
                                    value={this.state.addressName}
                                    helperText={this.state.helperTextForName}
                                    error={this.state.errorName}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment variant="filled" position="end" name="customInput">
                                                <Icon color={"inherit"}>

                                                    {/*<CircularProgress size={30}  />*/}

                                                    {
                                                        // this.state.isAddressNameFree ?  <CheckIcon color="primary" /> : <WarningIcon color="error" />
                                                        this.stateOfAddressNameTextField()

                                                    }


                                                </Icon>
                                            </InputAdornment>
                                        ),
                                    }}

                                />


                            </div>

                            <div className="col-md-8 col-sm-6">

                                <TextField
                                    className="m-2"
                                    name="address"
                                    label="Address "
                                    variant="outlined"
                                    fullWidth
                                    id="address"
                                    placeholder="Enter Wallet Address"
                                    required
                                    onChange={this.handlerChange}
                                    error={this.state.errorAddress}
                                    helperText={this.state.helperTextForAddress}
                                    value={this.state.address}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment variant="filled" position="end" name="customInput">
                                                <Icon color={"inherit"}>

                                                    {/*<CircularProgress size={30}  />*/}

                                                    {
                                                        // this.state.isAddressNameFree ?  <CheckIcon color="primary" /> : <WarningIcon color="error" />
                                                        this.stateOfAddressTextField()

                                                    }


                                                </Icon>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </div>


                    </div>


                </MuiThemeProvider>


                <hr/>
                <div className='m-4  footer'>
                    <Button name="tdnsSend" variant="contained" onClick={this.addTNS}
                            className={'sendButton' + (!!isValid ? '' : ' disabled')} size="small" disabled={!isValid}
                    >

                        {/* This Button uses a Font Icon, see the installation instructions in the docs. */}

                        <Save className={classNames(classes.leftIcon, classes.iconSmall)}/>

                        Registration


                    </Button>


                    <div className='warning small'>

                    </div>

                </div>
            </div>
        );


    }


    render() {

        return (<div>

                <div className='kontainer'>

                    {this.renderWalletInfo()}


                </div>


            </div>
        );
    }
}

export default withStyles(styles)(BitcoinTdns);
