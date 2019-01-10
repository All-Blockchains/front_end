import React from 'react';
import TronLinkGuide from '../../components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from '../../utils';
import Swal from 'sweetalert2';
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Save from '@material-ui/icons/Save'
import classNames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning'

import './App.scss';
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import BitcoinTdns from "../bitcoin/TDNSBITCOIN";

import CircularProgress from "@material-ui/core/CircularProgress";
import TextFormatIcon from '@material-ui/icons/TextFormat'
import {
    DISABLE_BITCOIN_TDNS,
    DONT_ADDRESS,
    ENABLE_BITCOIN_TDNS,
    MAIN_FOUNDATION_ADDRESS,
    MAIN_TRON_API
} from "../../utils/constants";
import Checkbox from "@material-ui/core/Checkbox";

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
    checkBoxRoot: {
        color: green[600],
        '&$checked': {
            color: green[500],
        },

    }

});

const theme = createMuiTheme({
    palette: {

        primary: green,
    },
    typography: {useNextVariants: true},
});

const callvalue = 0;

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            tronWeb: {
                installed: false,
                loggedIn: false
            },

            errorName: false,
            isAddressNameFree: true,
            loadingName: true,
            isValid: false,

            addressName: '',
            helperTextForName: 'Name Is Required >> Note :Name is case sensitive.',
            balance: 0,
            placeHolder: '',
            afterClick: false,
            fee: 0,
            checkedG: false,





        };


    }


    async componentDidMount() {

        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };

            if (tronWebState.installed) {
                this.setState({
                    tronWeb:
                    tronWebState
                });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if (tries >= 10) {

                    //const TRONGRID_API = 'https://api.shasta.trongrid.io';

                    window.TronWeb = new TronWeb(
                        MAIN_TRON_API,
                        MAIN_TRON_API,
                        MAIN_TRON_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

                if (!tronWebState.installed)
                    return tries++;

                this.setState({
                    tronWeb: tronWebState
                });

                resolve();

            }, 200);
        });

        if (!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(MAIN_FOUNDATION_ADDRESS),
                base58: MAIN_FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', () => {
                if (this.state.tronWeb.loggedIn)
                    return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }

        Utils.setTronWeb(window.tronWeb);

        const add = (await Utils.tronWeb.trx.getAccount()).address;

        this.setState({
            balance: await Utils.tronWeb.trx.getBalance(),

            placeHolder: Utils.tronWeb.address.fromHex(add)

        });


    }


    validation = async () => {

        return await !this.state.errorName && this.state.addressName !== "";
    };


    handlerChange = async event => {


        switch (event.target.name) {


            case 'addressName' :

                this.setState({addressName: event.target.value});

                if (event.target.value !== "") {


                    this.setState({addressName: event.target.value.trim()});
                    this.setState({loadingName: true});


                    const x = await this.getAddress(event.target.value.toString().trim());

                    this.setState({loadingName: false});


                    if (x !== DONT_ADDRESS) {

                        this.setState({
                            errorName: true,
                            isAddressNameFree: false,
                            helperTextForName: 'Already Taken ',
                            isValid: false
                        });

                    } else if (this.state.addressName === "") {

                        this.setState({errorName: false, helperTextForName: 'Name Is Required '});

                    } else {

                        this.setState({
                            isAddressNameFree: true,
                            errorName: false,
                            helperTextForName: 'Name is  Free ',
                            isValid: true
                        });

                    }
                } else {

                    this.setState({errorName: true, helperTextForName: 'Name Is Required', isValid: false})
                }

                break;


            default :
                break;

        }

        this.validation();
    };

    myChange = event => {


        this.setState({checkedG: event.target.checked});

        if (!this.state.checkedG) {

            //this.setState({errorTo: false, helperTo: 'Name is required.', sendTo: ''});


        } else {

            //this.setState({errorTo: false, helperTo: 'Address is required', sendTo: ''});


        }


    };


    async getAddress(name) {

        return await Utils.fetchAddress(name);

    }


    stateOfAddressNameTextField = () => {

        if (this.state.addressName.length === 0) {


            return <TextFormatIcon/>;


        } else {

            if (this.state.loadingName) {

                return <CircularProgress size={28}/>

            }
            return (this.state.isAddressNameFree ? <CheckIcon color="primary"/> : <WarningIcon color="error"/>);

        }

    };


    addTNS = async () => {

        const balance = await Utils.tronWeb.trx.getBalance();

        const {addressName} = this.state;


        const sure = await Swal({

            type: 'question',
            title: 'Are you sure for Name : ' + addressName + ' ? ',
            text: 'Cost of registration is 0 TRX plus 0.27 ~ 0.3 TRX for network fee ',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showCancelButton: true,


        });

        if (!sure.value) {

            return;
        }


        if ((await balance / 1000000) < 0) {
            Swal({

                title: 'Insufficient Balance ',
                text: 'you should have at least 11 TRX  ',
                type: 'error'
            });


            return;
        }


        Utils.contract.add(addressName.trim()).send({
            callValue: callvalue,
        }).then(async res => {

            setTimeout(async () => {
                const {data} = await Utils.getData(await res);

                const totalFee = (data.fee + callvalue) / 1000000;
                this.setState({fee: totalFee});

                setTimeout(async () => {

                    if (data.result === "FAILED") {
                        Swal({
                            title: 'Wrong Name ',
                            type: 'error',
                            text: 'Fee : ' + totalFee + ' TRX'

                        })
                    } else {

                        Swal({
                            title: 'Added Name',
                            titleText: addressName,
                            type: 'success',
                            text: 'Fee : ' + totalFee + ' TRX',
                            preConfirm: async () => {


                                this.setState({afterClick: true});

                                const b = this.state.balance - (data.fee + callvalue);

                                this.setState({balance: b});


                            }
                        })

                    }

                    this.setState({addressName: '', isValid: false, afterClick: false});


                }, 100);


            }, 2000)


        }).catch(err => {

            console.log(err);

        }).then(() => {

        });


    };


    renderWalletInfo() {

        const {isValid} = this.state;

        const {classes} = this.props;
        if (!this.state.tronWeb.installed)
            return <TronLinkGuide/>;

        if (!this.state.tronWeb.loggedIn)
            return <TronLinkGuide installed/>;

        return (

            <div className={'messageInput'}>


                <MuiThemeProvider theme={theme}>

                    <div className="container">

                        <div className="row">

                            <div className="col-md-6 col-sm-6 ">

                                <TextField
                                    className="m-2"
                                    label="Name "
                                    name="addressName"
                                    variant="outlined"
                                    placeholder="JustinSun.tron is differ from justinsun.tron"
                                    required
                                    id="addressName"
                                    fullWidth
                                    onChange={this.handlerChange}
                                    value={this.state.addressName}
                                    helperText={this.state.helperTextForName}
                                    error={this.state.errorName}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment variant="standard" position="end" name="customInput"
                                                            aria-setsize={28}>
                                                <Icon color={"inherit"}>


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
                            <div className="col-md-6 col-sm-6  ">

                                <small className='text-success '>
                                    <p className="m-2">
                                        Address : {this.state.placeHolder}
                                        <br/>
                                        Balance : {this.state.balance / 1000000} TRX
                                    </p>
                                </small>


                            </div>

                        </div>


                    </div>


                </MuiThemeProvider>
                <hr/>

                <small className=' m-4 footer'>

                    <Button name="tdnsSend" variant="contained" onClick={this.addTNS}
                            className={'sendButton ' + (!!isValid ? '' : ' disabled')} size="small" disabled={!isValid}>

                        {/* This Button uses a Font Icon, see the installation instructions in the docs. */}
                        <Save className={classNames(classes.leftIcon, classes.iconSmall)}/>
                        Register
                    </Button>
                    <h6 className="text-primary ml-2  text-danger">
                        <small>Name is case sensitive. it means JustinSun is differ with justinsun</small>
                    </h6>


                </small>
            </div>
        );


    }

    renderTDNSForm = () => {

        if (!this.state.checkedG === false) {

            return <BitcoinTdns/>;

        } else {
            return this.renderWalletInfo();

        }


    };

    render() {

        const {classes} = this.props;

        return (<div>

                <div className='kontainer'>
                    <div className='header white'>
                        <a href='https://tronwatch.market' target='_blank' rel='noopener noreferrer'>
                        </a>
                        <p className="text-muted">
                            <b> <span className="text-danger">Tron</span> Decentralized Name System ( <span
                                className="text-danger">T</span>
                                <small className="small">DNS</small>
                                ) </b>

                            <br/>
                            <span className="text-danger">T</span>
                            <small className="small">DNS</small>
                            is a DApp which allows you assign a unique, easy, memorable,readable name to your
                            wallet
                            address.<br/>

                            <small className="text-info "> For example : justinsun.tron =
                                TXmVpin5vq5gdZsciyyjdZgKRUju4st1wM
                            </small>
                            <br/>

                            <small className="text-primary "> then you can use <b
                                className="text-danger">justinsun.tron</b> in send form on <a
                                href="https://tronwallet.network"><b className="text-danger">TronWallet </b>
                            </a> instead of wallet address .
                            </small>
                            <br/>

                            {/*<small className="text-warning">Note : </small> <small className="text-success">11 TRX is needed to be in*/}
                            {/*your wallet to register a name</small>*/}


                        </p>
                    </div>

                    <label>

                        <Checkbox

                            onChange={this.myChange}
                            value="checkedG"
                            checked={this.state.checkedG}
                            classes={{

                                root: classes.checkBoxRoot,
                                checked: classes.checked,

                            }}

                        /> {!this.state.checkedG ? ENABLE_BITCOIN_TDNS : DISABLE_BITCOIN_TDNS}

                    </label>


                    {
                        this.renderTDNSForm()
                    }





                    <div className='header white p-2'>

                        <div className="row m-2">

                            <div className="col-md-6 text-muted text-justified small">
                                <b> How to use <span className="text-danger">T</span>DNS ? </b>

                                <br/>

                                Install TronLink and then import or create a wallet with at least 11 TRX <br/>
                                Enter a name in any language in <a href="#addressName"> Name </a> field.<br/>
                                For example :
                                JustinSun.tron , JustinSun, 贾斯汀太阳 <br/>
                                <a href="https://tronwallet.network" target="_blank"
                                   rel="noopener noreferrer">TronWallet</a> supports <span
                                className="text-danger">T</span>DNS. <br/>

                            </div>

                            <div className="col-md-6 text-muted text-justified small">
                                <b className="m-1"> Fee ? </b><br/>

                                Network fee = .27 ~ .3 TRX <br/>

                                Cost of using <span className="text-danger">T</span>DNS = 0 TRX<br/>

                                You can create multi name for your wallet address but note you can not delete name.

                            </div>

                        </div>

                        <hr className="hr"/>

                        <div className="row">


                            <small className="ml-4 mb-2 p-1">

                                <b className="text-danger"> Contact : </b>

                                <a href="https://github.com/TDNS" target="_blank"
                                   rel="noopener noreferrer"> <b className="text-secondary"> Github </b>
                                </a>
                                <a href="https://discordapp.com/channels/491685925227724801/505440567488937994"
                                   target="_blank"
                                   rel="noopener noreferrer"> <b className="text-info"> Discord </b>
                                </a>
                                <a href="https://telegram.me/gpsavad" target="_blank"
                                   rel="noopener noreferrer"> <b className="text-primary"> Telegram </b>
                                </a>


                            </small>


                        </div>


                    </div>

                </div>


            </div>
        );
    }
}

export default withStyles(styles)(App);
