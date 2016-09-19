import Vue from "vue";
import popover from "src/assets/commonjs/popover.js";
import _ from "lodash";

let getFlights,
    getFlight,
    lockFlight,
    unlockFlight,
    getPaxLoadFactor,
    getRemainSeats,
    queryPassenger,
    queryFlightVolunteers,
    chooseVolunteers,
    cancelVolunteers,
    waitingPassengerList,
    leavePassengersCleared,
    deletePassengers,
    registerCandidates,
    alternateFlightList,
    sendCandidateNotification,
    upgradesInformationQuery,
    confirmUpGrades,
    cancelUpGrades,
    queryTicketEterm,
    queryTicketParse,
    modifyWaitingInformation,
    doLogin,
    getUser,
    logout;

let accessToken = sessionStorage.getItem("access_token") || "";
let options = {};
let transParamsToOptions = function(params){
    _.extend(params,{accessToken:accessToken});
    var paramsjson = JSON.stringify(params);
    console.log(paramsjson);
    options.params = {requestData:paramsjson};
};



getFlights = (params,next) => {
    popover.loading.show();
    //accessToken = sessionStorage.getItem("access_token") || "";
    transParamsToOptions(params);
    Vue.http.get("Flight/queryFlights",options).then((res) => {
        res = res.json();
        popover.loading.hide();
        next && next(res)
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e})
    }).finally(() => {
        popover.loading.hide();
    })
}

getFlight = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("Flight/getFlight", options).then((res) => {
        console.log(res);
        //popover.loading.hide();
        res = res.json();
        next && next(res)
    }, (res) => {
        //popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        console.log(e)
    }).finally(() => {
        //popover.loading.hide();
    })
}

lockFlight = (params,next) => {
    //popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("Flight/lockFight", options).then((res) => {
        console.log(res);
        //popover.loading.hide();
        res = res.json();
        next && next(res)
    }, (res) => {
        //popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        console.log(e)
    }).finally(() => {
        //popover.loading.hide();
    })
}

unlockFlight = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("Flight/unlockFight", options).then((res) => {
        popover.loading.hide();
        console.log(res);
        res = res.json();
        next && next(res)
    }, (res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        console.log(e)
    }).finally(() => {
        popover.loading.hide();
    })
}

getPaxLoadFactor = (params,next) => {
    transParamsToOptions(params);
    Vue.http.get("Flight/getPaxLoadFactor", options).then((res) => {

        console.log(res);
        res = res.json();
        next && next(res)
    }, (res) => {
        //popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {

        console.log(e)
    }).finally(() => {

    })
}

getRemainSeats = (params,next) => {
    //popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("Flight/getRemainSeats", options).then((res) => {
        popover.loading.hide();
        console.log(res);
        res = res.json();
        next && next(res)
    }, (res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        console.log(e)
    }).finally(() => {
        popover.loading.hide();
    })
}




queryPassenger = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("RegisterCandidates/queryPassenger", options).then((res) => {
        popover.loading.hide();
        res = res.json();
        if(res.resultCode == "0"){
            popover.toast({message:res.resultDescription})
        }
        next && next(res)
    }, (res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        console.log(e)
    }).finally(() => {
        popover.loading.hide();
    })
}

queryFlightVolunteers = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("Volunteer/queryFlightVolunteers",options).then((res) => {
        popover.loading.hide();
        res = res.json();
        console.log(res);
        next && next(res)
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e})
    }).finally(() => {
        popover.loading.hide();
    })
}

chooseVolunteers = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("Volunteer/chooseVolunteers",options).then((res) => {
        popover.loading.hide();
        res = res.json();
        next && next(res);
        /*console.log(res[0].resultCode);
        if(+res[0].resultCode){
            next && next(res)
        }else{
            popover.toast({message:res[0].resultDescription})
        }*/

    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e})
    }).finally(() => {
        popover.loading.hide();
    })
}

cancelVolunteers = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("Volunteer/cancelVolunteers",options).then((res) => {
        popover.loading.hide();
        res = res.json();
        next && next(res)
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e})
    }).finally(() => {
        popover.loading.hide();
    })
}

waitingPassengerList = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("PassengerViewList/queryWaitingList",options).then((res) => {
        popover.loading.hide();

        next && next(res)
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e})
    }).finally(() => {
       popover.loading.hide();
    })
}


leavePassengersCleared = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("PassengerViewList/clearDepartedPassengers",options).then((res) => {
        popover.loading.hide();
    next && next(res)
},(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
    popover.alert({message:e})
}).finally(() => {
        popover.loading.hide();
})
}


deletePassengers = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("PassengerViewList/clearPassengers",options).then((res) => {
        popover.loading.hide();
    next && next(res)
},(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
    popover.alert({message:e})
}).finally(() => {
        popover.loading.hide();
})
}


registerCandidates = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("RegisterCandidates/register",options).then((res) => {
        popover.loading.hide();
        res = res.json();
        next && next(res)
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e})
    }).finally(() => {
        popover.loading.hide();
    })
}

alternateFlightList = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("Alternate/queryFlightWaitingList",options).then((res) => {
        popover.loading.hide();
    next && next(res)
},(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
    popover.alert({message:e})
}).finally(() => {
        popover.loading.hide();
})
}

sendCandidateNotification = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("Alternate/sendCandidateNotification",options).then((res) => {
        popover.loading.hide();
        res = res.json();
    next && next(res)
},(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
    popover.alert({message:e})
}).finally(() => {
        popover.loading.hide();
})
}

upgradesInformationQuery = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("ChangeSeatClass/queryFlightPassengers",options).then((res) => {
        popover.loading.hide();
    next && next(res)
},(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
    popover.alert({message:e})
}).finally(() => {
        popover.loading.hide();
})
}

confirmUpGrades = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("ChangeSeatClass/changeSeatClass",options).then((res) => {
        popover.loading.hide();
    res = res.json();
    next && next(res)
},(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
    popover.alert({message:e})
}).finally(() => {
        popover.loading.hide();
})
}

cancelUpGrades = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("ChangeSeatClass/cancelSeatClassChange",options).then((res) => {
        popover.loading.hide();
        res = res.json();
        next && next(res)
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e})
    }).finally(() => {
            popover.loading.hide();
    })
}

queryTicketEterm = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("RegisterCandidates/queryTicketEterm",options).then((res) => {
        res = res.json();
        popover.loading.hide();
        next && next(res)
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e})
    }).finally(() => {
        popover.loading.hide();
    })
}

queryTicketParse = (params,next) => {
    popover.loading.show();
    transParamsToOptions(params);
    Vue.http.get("RegisterCandidates/queryTicketParse",options).then((res) => {
        res = res.json();
        popover.loading.hide();
        next && next(res)
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e})
    }).finally(() => {
        popover.loading.hide();
    })
}

/**
 * 登录
 * @param options  =>  {"userName":"用户名","passWord":"密码"}
 * @param next
 */
doLogin = (options, next) => {
    let _options = {
        params: {
            requestData: JSON.stringify(options)
        }
    };
    Vue.http.get("Login/doLogin", _options).then((res) => {
        next && next(res.data);
        accessToken = sessionStorage.getItem("access_token") || "";
    },(res) => {
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.alert({message:e});
    }).finally(() => {

    });
};

/**
 * 获取用户信息
 * @param options  =>  {"userName":"用户名","token":"登录时候拿到的授权token"}
 * @param next
 */
getUser = (options, next) => {
    popover.loading.show();
    let _options = {
        params: {
            requestData: JSON.stringify(options)
        }
    };
    Vue.http.get("Login/getUser", _options).then((res) => {
        console.log("getUser:",res);
        popover.loading.hide();
        next && next(res.data);
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e});
    }).finally(() => {

    });
};


modifyWaitingInformation = (options, next) => {
    popover.loading.show();
    Vue.http.get("Alternate/updateComment", options).then((res) => {
     //   console.log("doLogin:",res);
    popover.loading.hide();
    next && next(res);
},(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
    popover.alert({message:e});
}).finally(() =>     {

    });
};
/**
 * 退出登录
 * @param options  =>  {"userName":"用户名","token":"登录时候拿到的授权token"}
 * @param next
 */
logout = (options, next) => {
    popover.loading.show();
    let _options = {
        params: {
            requestData: JSON.stringify(options)
        }
    };
    Vue.http.get("Login/logout", _options).then((res) => {
        console.log("logout:",res);
        popover.loading.hide();
        next && next(res.data);
    },(res) => {
        popover.loading.hide();
        popover.toast({message:'服务器或网络异常'})
    }).catch((e) => {
        popover.loading.hide();
        popover.alert({message:e});
    }).finally(() => {

    });
}

module.exports = {
    getFlights : getFlights,
    getFlight : getFlight,
    lockFlight: lockFlight,
    unlockFlight: unlockFlight,
    getPaxLoadFactor: getPaxLoadFactor,
    getRemainSeats: getRemainSeats,
    queryPassenger : queryPassenger,
    queryFlightVolunteers : queryFlightVolunteers,
    chooseVolunteers : chooseVolunteers,
    cancelVolunteers : cancelVolunteers,
    waitingPassengerList : waitingPassengerList,
    leavePassengersCleared:leavePassengersCleared,
    deletePassengers:deletePassengers,
    registerCandidates:registerCandidates,
    alternateFlightList:alternateFlightList,
    sendCandidateNotification:sendCandidateNotification,
    upgradesInformationQuery:upgradesInformationQuery,
    confirmUpGrades:confirmUpGrades,
    cancelUpGrades:cancelUpGrades,
    queryTicketEterm: queryTicketEterm,
    queryTicketParse: queryTicketParse,
    modifyWaitingInformation:modifyWaitingInformation,
    doLogin: doLogin,
    getUser: getUser,
    logout: logout
};
