<template>
    <div class="container-fluid">
        <!--Start Left Menu-->
        <menu :tabobj="tabObj"></menu>
        <!--Left Menu End-->
        <!--Start Right Main-->
        <div class="main col-xs-11 bg-gray">
            <ul class="mu-row login">
                <li class="first-list">
                    <img src="../assets/images/flightRadius.png" alt="">
                    <h4 class="title mu-row active">1.航线登记</h4>
                    <div class="wrap bg-white">
                        <div class="next-btn-click-hide" v-show="!showRegistInfoFlag">
                            <div class="padding-row clearfix">
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>日期 :</div>
                                    <div class="col-xs-7 modify">
                                        <input type="text" class="form-control form_datetime" placeholder="" readonly v-model="searchDate">
                                        <p class="shortcuts-prompt">d</p>
                                    </div>
                                </div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>舱位 : </div>
                                    <div class="col-xs-7 modify clearfix">
                                        <p class="check-once1"
                                           v-for="s in seatsList"
                                           track-by="$index"
                                           @click="toggleChecked($event,s,1)">
                                            <a href="javascript:;"
                                              class="check-box"
                                               :class="{'active':(s == 'Y')}"
                                            ></a>
                                            {{s}}
                                        </p>
                                    </div>
                                </div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>出发机场 : </div>
                                    <div class="col-xs-7 modify">
                                        <input type="text"
                                               class="form-control start-plane"
                                               v-model="queryFromAirport"
                                               onkeyup="value=value.replace(/[^a-zA-Z,]/g,'').toUpperCase()"
                                               onchange="value=value.replace(/[^a-zA-Z,]/g,'').toUpperCase()"
                                               @blur="removeAppointFlight"
                                        >
                                        <p class="shortcuts-prompt">s</p>
                                    </div>
                                </div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>到达机场 : </div>
                                    <div class="col-xs-7 modify">
                                        <input type="text"
                                               class="form-control end-plane"
                                               placeholder='通过" , "字符添加多个机场'
                                               v-model="queryToAirport"
                                               onkeyup="value=value.replace(/[^a-zA-Z,]/g,'').toUpperCase()"
                                               onchange="value=value.replace(/[^a-zA-Z,]/g,'').toUpperCase()"
                                               @blur="removeAppointFlight"
                                        >
                                        <p class="shortcuts-prompt">e</p>
                                    </div>
                                </div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title">航班指定 : </div>
                                    <div class="col-xs-7 modify">
                                        <input type="text"
                                               class="form-control search-end-input"
                                               v-model="appointFlight"
                                               onkeyup="value=value.replace(/[^a-zA-Z0-9,]/g,'').toUpperCase()"
                                               onchange="value=value.replace(/[^a-zA-Z0-9,]/g,'').toUpperCase()"
                                               @keyup.enter="checkFlightIsNull"
                                        >
                                    </div>
                                    <div class="col-xs-2"><a href="javascript:void(0)" class="search-btn" @click="showSearch">航班列表</a></div>
                                </div>
                            </div>
                            <hr/>
                            <div class="mu-row text-center targetWidth" @click="toRegistInfo">
                                <button class="btn bg-deep-blue next-btn width-140">旅客信息登记</button>
                                <p class="shortcuts-prompt">n</p>
                            </div>
                        </div>
                        <div class="next-btn-click-show mu-row padding-row" v-show="registBriefInfo">
                            <div class="mu-row">
                                日期 : <span class="selectDate"></span>&nbsp;&nbsp;&nbsp;&nbsp; 航线:<span class="select-from-to">{{queryFromAirport}} - {{queryToAirport}}</span>&nbsp;&nbsp;&nbsp;&nbsp;舱位:<span class="select-seats">{{selectSeatStr}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="appointFlight != ''">指定航班：</span><span class="appoint-flight">{{appointFlight}}</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="next-list">
                    <img src="../assets/images/infoRadius.png" alt="">
                    <div class="clearfix mu-row">
                        <h4 class="title pull-left">2.旅客信息登记</h4>
                        <div class="associated pull-right padding-row">
                            <button class="btn bg-deep-blue associated-btn width-140" v-show="showRegistInfoFlag && showAssociaButton" @click="associationRegist($event)">关联旅客登记</button>
                        </div>
                    </div>
                    <div class="wrap bg-white information" v-show="showRegistInfoFlag">
                        <div class="associated-click-hide scroll-max-height-wrap">
                            <!-- Nav tabs -->
                            <ul class="tab-menu-list clearfix bg-gray" role="tablist" v-show="!bottomBtnFlag">
                                <li role="presentation" :class="{'active':$index == (assPassengerList.length-1)}"
                                    v-for="l in assPassengerList"
                                    track-by="$index">
                                    <a aria-controls="home" role="tab" data-toggle="tab" @click="selectAssPassenger(l,$event)">{{l.name}}</a>
                                    <span class="deleteBtn" @click="deleteOnePassenger(l,$index)">×</span>
                                </li>
                                <!--<li class="add-ele" @click="addAssPassenger($event)"><a href="javascript:void (0)"></a></li>-->
                            </ul>
                            <div class="padding-row clearfix">
                                <div class="mu-row" v-show="bottomBtnFlag">旅客信息</div>
                                <div class="mu-row" v-else>旅客姓名</div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>姓名 :</div>
                                    <div class="col-xs-7 modify">
                                        <input type="text" class="form-control user-name" placeholder="姓名" v-model="passengerName" @keyup.enter="queryPassengerTicket">
                                        <p class="shortcuts-prompt">m</p>
                                    </div>
                                </div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>证件号 : </div>
                                    <div class="col-xs-7 modify">
                                        <input type="text" autofocus class="form-control id-card" placeholder="" v-model="passengerId" @blur="saveLastId">
                                        <div class="col-xs-2 absolute">
                                            <!--<button class="btn bg-deep-blue">一键填写</button>-->
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>联系电话 : </div>
                                    <div class="col-xs-7 modify">
                                        <input type="text" class="form-control phone-num" placeholder="" v-model="passengerContact">
                                        <p class="shortcuts-prompt">p</p>
                                    </div>
                                </div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>证件类型 : </div>
                                    <div class="col-xs-7 modify">
                                        <!--<input type="text" class="form-control" placeholder="通过+字符添加多个机场">-->
                                        <div class="dropdown">
                                            <button class="btn btn-default dropdown-toggle bg-white card-defind" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                <span class="input-txt">{{selectedCert}}</span>
                                                <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                                <li v-for="c in certificateType" track-by="$index" @click="selectCertType(c)"><a href="javascript:void (0)">{{c}}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title">&nbsp;常客卡号 :</div>
                                    <div class="col-xs-7 modify">
                                        <input type="text" class="form-control" placeholder="" v-model="passengerCardNo">
                                    </div>
                                </div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>旅客属性 : </div>
                                    <div class="col-xs-7 modify">
                                        <!--<input type="text" class="form-control" placeholder="">-->
                                        <div class="dropdown">
                                            <button class="btn btn-default dropdown-toggle bg-white person-defind" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                <span class="input-txt">{{selectedPass}}</span>
                                                <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu3">
                                                <li v-for="a in passengerAttr" track-by="$index" @click="selectedPassAttr(a)"><a href="javascript:void (0)">{{a}}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title"><span class="requiredFlag">*</span>常客等级 : </div>
                                    <div class="col-xs-7 modify">
                                        <!--<input type="text" class="form-control" placeholder="通过+字符添加多个机场">-->
                                        <div class="dropdown">
                                            <button class="btn btn-default dropdown-toggle bg-white rank-defind" type="button" id="dropdownMenu4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                <span class="input-txt">{{selectedFre}}</span>
                                                <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu4">
                                                <li v-for="g in frequenterGrade" track-by="$index" @click="selectedFreGrade(g)"><a href="javascript:void (0)">{{g}}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-xs-6 clearfix mu-row">
                                    <div class="col-xs-3 info-title">&nbsp;备注 : </div>
                                    <div class="col-xs-7 modify"><input type="text" class="form-control edit-r" placeholder="" v-model="commentText"></div>
                                </div>
                            </div>
                            <style>
                                .scroll-col .col-xs-20{
                                    line-height: 50px;
                                }
                            </style>
                            <div class="padding-row select-ticket" v-show="ticketsInfoFlag">
                                <div class="mu-row">客票选择</div>
                                <div class="write col-xs-6">
                                    <ul class="clearfix scroll-col">
                                        <li class="col-xs-3">请输入客票 : </li>
                                        <li class="col-xs-7"><input v-model="typeInTicketNo" type="text" class="form-control onblur-alert" placeholder="" @keyup.enter="alertQueryTicket"></li>
                                    </ul>
                                </div>
                                <div style="clear: both"></div>
                                <div class="clearfix">
                                    <ul class="scroll-row">
                                        <li class="scroll-header">
                                            <ul class="clearfix scroll-col">
                                                <li class="col-xs-20 text-left check-all">

                                                </li>
                                                <li class="col-xs-20">航线</li>
                                                <li class="col-xs-20">状态</li>
                                                <li class="col-xs-20">舱位</li>
                                                <li class="col-xs-20">票号</li>
                                            </ul>
                                        </li>
                                        <li  v-if="queryTicketList.length > 0" class="line-list" v-for="t in queryTicketList" track-by="$index">
                                            <ul class="scroll-col clearfix ticketList">
                                                <li class="col-xs-20 text-left check-once" @click="selectTicketInfo(t)">
                                                    <a href="javascript:void (0)" class="single-box" :class="{'active':t.checked}"></a>
                                                </li>
                                                <li class="col-xs-20">{{t.fromAirportCode}} - {{t.toAirportCode}}</li>
                                                <li class="col-xs-20">{{t.ticketStatus}}</li>
                                                <li class="col-xs-20">{{t.seatClass}}</li>
                                                <li class="col-xs-20"><a href="">{{t.ticketNo}}</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <hr style="padding-bottom:70px;" v-show="queryTicketList.length > 0">
                            <div class="mu-row text-center" v-show="bottomBtnFlag">
                                <button class="btn width-140 return-first border-deep-blue bg-white" style="color:#4483ea" @click="modifyAirLine">修改航线</button>
                                <button class="btn bg-deep-blue width-140 ok-next-one" @click="confirmRegist(1)">确认登记</button>
                            </div>
                            <div class="mu-row text-center" v-show="!bottomBtnFlag">
                                <button class="btn bg-deep-blue width-140 ok-next-one" @click="confirmToRegNext">确认并登记下一位</button>
                                <button class="btn width-140 return-first border-deep-blue bg-white"  style="color:#4483ea" @click="overAssociationReg">结束关联登记</button>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!--Right Main End-->
    </div>
    <div class="fixed-bg-opacity" v-show="showSearchFlag">
        <div class="search-box mu-row padding-row bg-white">
            <div class="js clearfix">
                <!--<div class="col-xs-12 mu-row">航班搜索</div>
                <div class="form-input clearfix">
                    <div class="col-xs-4 mu-row">
                        <div class="col-xs-3"><span class="requiredFlag">*</span>出发机场</div>
                        <div class="col-xs-8">
                            <input type="text"
                                   class="form-control search-start-plane"
                                   placeholder=""
                                   v-model="queryFromAirport"
                                   onkeyup="value=value.replace(/[^a-zA-Z,]/g,'')"
                                   onchange="value=value.replace(/[^a-zA-Z,]/g,'')"
                            >
                        </div>
                    </div>
                    <div class="col-xs-4 mu-row">
                        <div class="col-xs-3"><span class="requiredFlag">*</span>到达机场</div>
                        <div class="col-xs-8">
                            <input type="text"
                                   class="form-control search-end-plane"
                                   placeholder=""
                                   v-model="queryToAirport"
                                   onkeyup="value=value.replace(/[^a-zA-Z,]/g,'')"
                                   onchange="value=value.replace(/[^a-zA-Z,]/g,'')"
                            >
                        </div>
                    </div>
                    <div class="col-xs-4 mu-row">
                        <div class="col-xs-3">航班号</div>
                        <div class="col-xs-8">
                            <input type="text"
                                   class="form-control search-flight"
                                   placeholder=""
                                   v-model="searchFlights"
                                   onkeyup="value=value.replace(/[^a-zA-Z0-9,]/g,'')"
                                   onchange="value=value.replace(/[^a-zA-Z0-9,]/g,'')"
                            >
                        </div>
                    </div>
                    <div class="col-xs-4 mu-row">
                        <div class="col-xs-3"><span class="requiredFlag">*</span>日期</div>
                        <div class="col-xs-8"><input type="text" class="form-control search-date form_datetime" placeholder="" v-model="searchDate" readonly></div>
                    </div>
                    <div class="col-xs-4 mu-row">
                        <div class="col-xs-3">起飞时间</div>
                        <div class="col-xs-8">
                            <input type="text" class="form-control" placeholder="" v-model="queryStartTime" @click="startTimeFlag=!startTimeFlag" readonly="true">
                            <ul class="time-select" v-show="startTimeFlag">
                                <li v-for="t in timeLine" track-by="$index" @click="selectStartTime(t)">{{t}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xs-4 mu-row">
                        <div class="col-xs-11 clearfix">
                            <button class="btn bg-deep-blue text-center col-xs-3" @click="refineSearch">搜 索</button>
                            <button class="btn bg-white border-deep-blue text-center col-xs-3 reset-btn" @click="resetSearch">重 置</button>

                        </div>
                    </div>
                </div>-->
                <div class="col-xs-12 mu-row padding-row plane-search-title clearfix">
                    <span class="tit">航班列表</span>
                    日期 : <span class="search-time" v-text="searchDate"></span>
                    航线 : <span class="search-airline">{{queryFromAirport}} - {{queryToAirport}}</span>
                </div>
            </div>
            <div class="mu-row person-list">
                <div class="scroll-header padding-row">
                    <ul class="scroll-col clearfix">
                        <li class="col-xs-16 check-all"  @click="checkAll($event)">
                            <a href="javascript:void (0)" class="check-box"></a>
                        </li>
                        <li class="col-xs-16">
                            航班
                        </li>
                        <li class="col-xs-16">
                            日期
                        </li>
                        <li class="col-xs-16">
                            起飞时间
                        </li>
                        <li class="col-xs-16">
                            航班状态
                        </li>
                        <li class="col-xs-16">
                            飞行状态
                        </li>
                    </ul>
                </div>
                <div class="scroll-max-height-wrap scroll-center">
                    <ul class="scroll-row">
                        <li class="padding-row line-list" v-for="l in searchFlightList" track-by="$index">
                            <ul class="scroll-col clearfix">
                                <li class="col-xs-16 check-once"  @click="toggleChecked($event,l)">
                                    <a href="javascript:void (0)" class="check-box" data-flightno="{{l.flightNo}}"></a>
                                </li>
                                <li class="col-xs-16 line-two">
                                    <p>{{l.flightNo}}</p>
                                    <p>{{l.fromAirportCode}} - {{l.toAirportCode}}</p>
                                </li>
                                <li class="col-xs-16">
                                    {{l.date}}
                                </li>
                                <li class="col-xs-16">
                                    {{l.departureTime}}
                                </li>
                                <li class="col-xs-16">
                                    {{l.flightStatus}}
                                </li>
                                <li class="col-xs-16">
                                    {{l.flyStatus}}
                                </li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
            <div class="mu-row text-center bg-white">
                <button class="btn bg-deep-blue width-140 close-btn-2" @click="closeSearch">指定航班</button>
                <button class="btn btn-default width-140 shortcuts" @click="showSearchFlag = false">取 消</button>
            </div>
            <a href="javascript:void (0)" class="close-btn" @click="showSearchFlag = false">
                <img src="../assets/images/closelight2@.png" alt="">
            </a>
        </div>
    </div>
    <div class="confirm" v-show="alertQueryTicketFlag">
        <div class="confirm-box">
            <div class="ticket-content">
                <pre>{{alertTicketInfo}}</pre>
            </div>
            <div class="btn-group">
                <button class="btn bg-deep-blue true" @click="selectAlertTicket">选 择</button>
                <button class="btn btn-default false" @click="alertQueryTicketFlag = false">取 消</button>
            </div>
        </div>
    </div>
    <loading></loading>
</template>

<script>
    import Vue from "vue";
    import menu from "./leftMenu.vue";
    import loading from "./loading.vue";
    import _ from "lodash";
    import servers from "../servers.js";
    import popover from "../assets/commonjs/popover.js";

    export default {
        components: {
            menu,
            loading
        },
        http: {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        },
        data: function () {
            return {
                tabObj: {
                    workbench: false,
                    registration: true,
                    passenger: false
                },
                queryDate: sessionStorage.getItem("select_date") || '',
                seatsList: ['F','J','Y'],
                selectSeatsList:["Y"],
                selectSeatStr:'',
                certificateType: ["身份证","护照","军官证","台胞证","台湾通行证","港澳通行证","回乡证","其它"],
                selectedCert: "身份证",
                passengerAttr:["成人","儿童","婴儿"],
                selectedPass: "成人",
                frequenterGrade: ["V","G","E+","S","E","C","无"],
                selectedFre: "无",
                queryFromAirport: 'SHA',
                queryToAirport: '',
                queryStartTime: '',
                searchDate:'',
                searchFlights:'',
                searchFlightList:[],
                appointFlight:'',
                airLineInfo: {},
                passengerId :'',
                passengerName : '',
                passengerContact: '',
                passengerCardNo: '',
                unionGrade: '',
                queryPassengerInfo:[],
                queryTicketList: [],
                commentText: '',
                showRegistInfoFlag: false,
                ticketsInfoFlag: false,
                registBriefInfo: false,
                showSearchFlag: false,
                checkedFlightList: [],
                bottomBtnFlag: true,
                assPassengerList: [],
                showAssociaButton: false,
                currentMainPassSelectedTicket : [],
                commitAlternateData:[],
                commitMultiAlternateData:[],
                startTimeFlag: false,
                alertQueryTicketFlag: false,
                alertTicketInfo:'',
                typeInTicketNo:'',
                lastAssPassId:'',
                timeLine : ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00']
            }
        },
        route: {

        },
        methods: {
            saveLastId:function(){
                this.lastAssPassId = this.passengerId
            },
            checkTypeInIsComplete:function(callback){
                var self = this;
                if(self.passengerName == "" || self.passengerId == ""
                    || self.passengerContact == "" || self.selectedCert == ""
                    || self.selectedFre == "" || self.selectedPass == ""
                ){
                    popover.alert({message:"请先将旅客信息登记完整"});
                    return;
                }
                callback && callback()
            },
            checkFlightIsNull: function(callback){
                var self = this;
                if(self.appointFlight != ""){
                    var date = $(".form_datetime").val();
                    self.queryFromAirport = self.queryFromAirport.toUpperCase();
                    self.queryToAirport = self.queryToAirport.toUpperCase();
                    self.appointFlight = self.appointFlight.toUpperCase();
                    var currentHours = new Date().getHours();
                    var flights = [];
                    if(self.appointFlight.indexOf(",") > -1){
                        flights = self.appointFlight.split(",")
                    }else{
                        flights.push(self.appointFlight)
                    }

                    var params = {'date':date,'fromAirportCode':self.queryFromAirport,'toAirportCode':self.queryToAirport,'flights':self.appointFlight,'startTime': ''};//startTime:self.timeLine[currentHours] 只能返回一条数据？？
                    servers.getFlights(params,function(res){
                        console.log(res);
                        var queryFlightsList = [];
                        var hasThisFlightNo = "";
                        if(res && res.length == 0){
                            popover.alert({message:"该航线查不到这些航班"})
                            return;
                        }else{
                            if(res && res.length != flights.length){
                                _.each(res,(r) => {
                                    queryFlightsList.push(r.flightNo)
                                });
                                _.each(flights,(f) => {
                                    var hasNoFlight = _.find(queryFlightsList,(l)=>{
                                        return l == f
                                    });
                                    if(!hasNoFlight){
                                        hasThisFlightNo += f + "、";
                                    }
                                });
                                hasThisFlightNo = hasThisFlightNo.slice(0,-1);
                                popover.alert({message:"查不到航班"+hasThisFlightNo})
                                return;
                            }else{
                                callback && callback()
                            }
                        }
                    })
                }else{
                    callback && callback()
                }
            },
            selectTicketInfo: function(t){
                var self = this;
                t.checked = !t.checked;
                var ticketInfos = [];
                if(t.checked){
                    _.each(self.queryTicketList,(l) => {
                        l.checked = false
                    })
                    t.checked = true;
                    ticketInfos.push(t);
                }
                sessionStorage.setItem("ticket_infos_"+t.identityNo,JSON.stringify(ticketInfos));
            },
            selectAlertTicket: function(){
                var self = this;
                var params = {"ticketNo": self.typeInTicketNo};
                servers.queryTicketParse(params,function(res){
                    console.log(res);
                    self.alertQueryTicketFlag = false;
                    self.queryTicketList = [];
                    var ticketInfos = {
                        "checked":true,
                        "fromAirportCode":res.fromAirportCode || "",
                        "identityNo":"",
                        "name":"",
                        "seatClass":res.seatClass || "",
                        "ticketNo":self.typeInTicketNo || res.ticketNo || "",
                        "ticketStatus": res.ticketStatus || "",
                        "toAirportCode": res.toAirportCode || ""
                    };
                    self.queryTicketList.push(ticketInfos);
                    sessionStorage.setItem("ticket_infos_"+self.passengerId,JSON.stringify(self.queryTicketList));
                });
            },
            alertQueryTicket: function(){
                var self = this;
                self.alertQueryTicketFlag = true;
                var params = {"ticketNo":self.typeInTicketNo || "781-8528216169"};

                servers.queryTicketEterm(params,function(res){
                    console.log(res);
                    self.alertTicketInfo = res.resultDescription;
                })
            },
            removeAppointFlight: function(){
                this.appointFlight = "";
                $(".appointFlight").val("");
            },
            selectStartTime: function(t){
                this.queryStartTime = t;
                this.startTimeFlag = false;
            },
            showStartTimeLine: function(){
                this.startTimeFlag = !this.startTimeFlag
            },
            initRegisterInput: function(){
                this.passengerName = "";
                this.passengerId = "";
                this.passengerContact = "";
                this.passengerCardNo = "";
                this.commentText = "";
                this.unionGrade = "";
                this.selectedCert = "身份证";
                this.selectedPass = "成人";
                this.selectedFre = "无";
                this.typeInTicketNo = "";
            },

            addNullAssPassenger: function(){
                this.assPassengerList.push({
                    "name": "",
                    "identityNo": ""
                });
            },
            renderPassInfo: function(args){
                var self = this;
                self.queryTicketList = args.ticketInfos;
                self.passengerName = args.name;
                self.passengerId = args.identityNo;
                self.passengerCardNo = args.frequentPassengerCardNo;
                self.passengerContact = args.contact;
                self.unionGrade = args.allianceCardNo;
                //self.selectedPass = args.ageGroup;
                //self.selectedCert = args.identityType;
                self.commentText = args.comment;
                self.selectedFre = (args.frequentPassengerClassEN + (args.allianceCardNo?("/" + args.allianceCardNo):"")) || "无";
            },
            toTypeInName: function(){
                $(".user-name").focus();
            },
            addAssPassenger: function(e){
                this.addNullAssPassenger();
                this.initRegisterInput();
                this.$nextTick(function(){
                    $(e.currentTarget).siblings("li").removeClass("active");
                    $(e.currentTarget).prev("li").addClass("active");
                })
            },
            deleteOnePassenger: function(item,index){
                this.assPassengerList.$remove(item);
                var self = this;
                console.log(self.assPassengerList.length);
                if(self.assPassengerList.length == 0){
                    self.bottomBtnFlag = true;
                    $(".associated-btn").removeClass("color-gray");
                    self.initRegisterInput();
                }else{
                    var preassPassenger = self.assPassengerList[index - 1] || self.assPassengerList[index + 1];
                    console.log(preassPassenger);
                    if(!preassPassenger){

                        preassPassenger = {
                            'identityNo': self.lastAssPassId
                        }
                    }
                    self.selectAssPassenger(preassPassenger);
                }
            },
            selectAssPassenger: function(l){
                var self = this;
                console.log(l);
                if(l.identityNo == ""){
                    self.initRegisterInput();
                    self.queryTicketList = [];
                    return false;
                }
                //not save commit
                var sessionMainPassengerInfo = JSON.parse(sessionStorage.getItem("main_pass_info_"+l.identityNo));
                var sessionMainPassengerInfoArr = [];
                sessionMainPassengerInfoArr.push(sessionMainPassengerInfo);
                var currentPassengerInfo =
                    _.filter(self.commitMultiAlternateData,(d) => {
                        return d.identityNo == l.identityNo
                    });
                if(currentPassengerInfo.length == 0){
                    currentPassengerInfo = sessionMainPassengerInfoArr;
                }
                console.log(sessionMainPassengerInfoArr);

                currentPassengerInfo[0].ticketInfos = [];
                currentPassengerInfo[0].ticketInfos = JSON.parse(sessionStorage.getItem("ticket_infos_"+l.identityNo)) || [];
                console.log(currentPassengerInfo[0]);
                self.renderPassInfo(currentPassengerInfo[0]);
            },
           /* overAssociationReg:function(){
                var self = this;
                var callback = function(){
                    var mainPassId = sessionStorage.getItem("main_pass_id");
                    console.log(mainPassId);
                    var mainPassInfo = JSON.parse(sessionStorage.getItem("main_pass_info_" + mainPassId));
                    console.log(mainPassInfo);
                    self.renderPassInfo(mainPassInfo);
                    self.bottomBtnFlag = true;
                    $(".associated-btn").removeClass("color-gray");
                };
                if(self.passengerId == ""){
                    callback();
                    return;
                }

                self.confirmRegistMergeParams(callback);
            },*/
            overAssociationReg:function(){
                var self = this;
                var callback = function(){
                    self.bottomBtnFlag = true;
                    $(".associated-btn").removeClass("color-gray");
                    self.initRegisterInput();
                    self.ticketsInfoFlag = false;
                };
                if(self.commitMultiAlternateData.length == 0){
                    callback();
                }else{
                    if(self.passengerName == "" && self.passengerId == ""
                        && self.passengerContact == ""){
                        self.confirmRegist(0,callback);
                    }else{
                        self.checkTypeInIsComplete(function(){
                            self.confirmRegist(1,callback);
                        });
                    }
                }

            },

            confirmToRegNext: function(){
                var self = this;
                self.checkTypeInIsComplete(function(){
                    self.confirmRegistMergeParams(1,function(){
                        //clear empty and add null asspassenger bar
                        self.addNullAssPassenger();
                        self.initRegisterInput();
                        self.queryTicketList = [];
                        //self.ticketsInfoFlag = false;
                    });
                });
            },
            selectCertType: function(c){
                this.selectedCert = c;
            },
            selectedPassAttr: function(a){
                this.selectedPass = a;
            },
            selectedFreGrade: function(g){
                this.selectedFre = g;
            },
            associationRegist: function(e){

                var self = this;
                var liList = $(".tab-menu-list li");
                var liListLen = liList.length;
                liList.each(function(index,el){
                    $(el).removeClass("active");
                })
                $(liList[liListLen -1]).addClass("active");
                //clear commitMultiAlternateData
                self.commitMultiAlternateData = [];
                sessionStorage.removeItem("commit_multi_alternate_data");
                //clear assPassengerList
                self.assPassengerList = [];
                var callback = function(){
                    var mainPassengerInfo = {
                        "ageGroup":"",
                        "allianceCardNo":"",
                        "contact":"",
                        "frequentPassengerCardNo":"",
                        "frequentPassengerClassEN":"",
                        "identityNo":"",
                        "identityType":"",
                        "name":"",
                        "ticketInfos":[],
                        "commentText":""
                    };
                    mainPassengerInfo.ageGroup = self.selectedPass;
                    mainPassengerInfo.allianceCardNo = self.unionGrade || '';
                    mainPassengerInfo.contact = self.passengerContact;
                    mainPassengerInfo.frequentPassengerCardNo = self.passengerCardNo;
                    mainPassengerInfo.frequentPassengerClassEN = self.selectedFre || '';
                    mainPassengerInfo.identityNo = self.passengerId;
                    mainPassengerInfo.identityType = self.selectedCert;
                    mainPassengerInfo.name = self.passengerName;
                    mainPassengerInfo.comment = self.commentText;
                    mainPassengerInfo.ticketInfos = JSON.parse(sessionStorage.getItem("ticket_infos_"+self.passengerId)) || [];

                    sessionStorage.setItem("main_pass_id",self.passengerId);
                    sessionStorage.setItem("main_pass_info_" + self.passengerId,JSON.stringify(mainPassengerInfo));

                    self.bottomBtnFlag = false;

                    $(e.currentTarget).addClass("color-gray");
                    $(".id-card").focus();
                    self.initRegisterInput();

                    self.queryTicketList = [];

                    self.$nextTick(function(){
                        /*self.assPassengerList = _.reject(self.assPassengerList,(l)=>{
                                return l.identityNo == ""
                            })*/
                        self.addNullAssPassenger();
                    })
                };
                callback();
                //self.confirmRegistMergeParams(callback);
            },
            modifyAirLine: function(){
                this.showRegistInfoFlag = false;
                this.registBriefInfo = false;
            },
            showSearch: function(){
                var self = this;
                if(self.queryFromAirport == "" || self.queryToAirport == "" || $(".form_datetime").val() == ""){
                    popover.alert({message:"请输入查询出发地、目的地、日期"})
                    return;
                }
                this.showSearchFlag = true;

                this.$nextTick(function(){
                    self.searchFlightList = [];
                    self.refineSearch();
                    var
                            eleParentHeight = $(".search-box").height(),
                            selfTop = $(".search-box >.text-center").height(),
                            topHeight = $(".js").height(),
                            endHeight = eleParentHeight - selfTop - topHeight-20;
                    $(".scroll-center").height(endHeight);
                })
            },
            closeSearch: function(){
                var self = this;
                var selectStr = "";
                $(".person-list .line-list li").find(".check-box").each(function(i,e){
                    if($(e).hasClass("active")){
                        selectStr += $(e).data("flightno") + ","
                    }
                })
                selectStr = selectStr.slice(0,-1);
                console.log(selectStr);
                self.appointFlight = selectStr;
                console.log(self.appointFlight);
                /*$(".search-end-input").val(selectStr);
                $(".appoint-flight").html(selectStr);*/

                this.showSearchFlag = false;
            },
            checkAll: function(e){
                e.preventDefault();
                e.stopPropagation();
                var self = this;

                var flag = $(e.currentTarget).find('.check-box').hasClass("active");
                if(flag){
                    $(".check-box").each(function(i,el){
                        $(el).removeClass("active");
                    });
                }else{
                    $(".check-box").each(function(i,el){
                        $(el).addClass("active");
                    });
                }
            },

            toggleChecked: function(e,l,flag){
                var self = this;
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                $(e.currentTarget).find('.check-box').toggleClass("active");
                $(".person-list .check-all").find(".check-box").removeClass("active");
                var has = false;
                if(flag){
                    if($(e).hasClass("active")){
                        self.selectSeatsList.forEach(function(el){
                            if(el == l){
                                has = true
                            }
                        })
                    }else{
                        self.selectSeatsList.$remove(l)
                    }

                    if(!has){
                        self.selectSeatsList.push(l)
                    }
                }
            },


            toRegistInfo: function(){
                var self = this;
                var callback = function(){
                    self.showRegistInfoFlag = true;
                    self.showAssociaButton = true;
                    self.registBriefInfo = true;
                    self.$nextTick(function(){
                        var elel = $(".associated-click-hide");
                        var needSomeEle = $(".next-btn-click-show");
                        var $idCardInput = $(".id-card");
                        $idCardInput.focus();
                        elel.height($(window).height() - $(".next-list .title").offset().top);
                        $(".associated-click-hide .mu-row.text-center").css({
                            "position":"fixed",
                            "left":needSomeEle.offset().left,
                            "bottom":0,
                            "width":needSomeEle.outerWidth(),
                            "background":"#fff"
                        });
                    });

                    self.airLineInfo = {
                        "queryDate":"",
                        "queryFromAirport":"",
                        "queryToAirport":"",
                        "queryFlight":"",
                        "airSpace":""
                    };

                    var queryFlight = self.appointFlight;
                    self.airLineInfo.queryDate = $(".form_datetime").val();
                    self.airLineInfo.queryFromAirport = self.queryFromAirport;
                    self.airLineInfo.queryToAirport = self.queryToAirport;
                    self.airLineInfo.queryFlight = queryFlight;
                    self.airLineInfo.airSpace = self.selectSeatsList.join(",");
                    $(".selectDate").html($(".form_datetime").val());
                    sessionStorage.setItem('air_line_info',JSON.stringify(self.airLineInfo));
                    self.selectSeatStr = self.airLineInfo.airSpace;
                };
                if(self.queryFromAirport == '' || self.queryToAirport == ''){
                    popover.alert({message:"请将航线登记完整后再进行旅客登记"})
                    return false;
                }
                var date = $(".form_datetime").val();
                self.queryFromAirport = self.queryFromAirport.toUpperCase();
                self.queryToAirport = self.queryToAirport.toUpperCase();
                /*var currentHours = new Date().getHours();
                currentHours = currentHours > 9?currentHours:("0" + currentHours);
                var currentMinu = new Date().getMinutes();
                currentMinu = currentMinu > 9?currentMinu:("0" + currentMinu);
                var currentTime = "" + currentHours + ":" + currentMinu;*/
                var params = {'date':date,'fromAirportCode':self.queryFromAirport,'toAirportCode':self.queryToAirport,'flights':'','startTime': ''};

                servers.getFlights(params,function(res){
                    console.log(res);
                    self.searchFlightList = [];
                    res.forEach(function(r){
                        if(r.flyStatus == "未起飞"){
                            self.searchFlightList.push(r);
                        }
                    })

                    self.$log("searchFlightList");
                    if(self.searchFlightList.length == 0){
                        popover.alert({message:"该航线暂时没有航班"});
                        return
                    }else{
                        self.checkFlightIsNull(function(){
                            /*var appointFlight = "";
                            _.each(self.searchFlightList,(l) => {
                                appointFlight += l.flightNo + ','
                            });
                            if(self.appointFlight == ""){
                                self.appointFlight = appointFlight.slice(0,-1);
                            }*/

                            callback();
                        });
                    }
                })
            },
            refineSearch: function(){
                var self = this;
                if(self.queryFromAirport == "" || self.queryToAirport == "" || $(".form_datetime").val() == ""){
                    popover.alert({message:"请输入查询出发地、目的地、日期"})
                    return;
                }

                var date = self.searchDate || $(".form_datetime").val();
                console.log(self.searchDate);
                self.searchFlights = self.searchFlights.toUpperCase();
                self.queryFromAirport = self.queryFromAirport.toUpperCase();
                self.queryToAirport = self.queryToAirport.toUpperCase();
                //var queryFlight = self.appointFlight;

                /*var flights = [];
                if(queryFlight.indexOf(",") > -1){
                    flights = queryFlight.split(",")
                }else{
                    flights.push(queryFlight)
                }*/
                var params = {'date':date,'fromAirportCode':self.queryFromAirport,'toAirportCode':self.queryToAirport,'flights':'','startTime': ''};
                servers.getFlights(params,function(res){
                    console.log(res);
                    self.searchFlightList = [];
                    res.forEach(function(r){
                        if(r.flyStatus == "未起飞"){
                            self.searchFlightList.push(r);
                        }
                    })

                    self.$log("searchFlightList");
                    if(self.searchFlightList.length == 0){
                        popover.alert({message:"查询“未起飞”的航班列表为空"})
                    }
                    self.searchFlightList = _.sortBy(self.searchFlightList,"departureTime");
                })
                //Adaptive flight query list height
                var adaptiveWindow = function(){
                    var
                        maxHeightWrap = $(".scroll-max-height-wrap").not(".scroll-center"),
                        bottomFixedEle = $(".bottom-btn");

                    var targetWidthEle = $(".targetWidth").width();
                    var windowHeight = $(window).height();
                    bottomFixedEle.css({
                        "width":targetWidthEle+1,
                        "left" :50+"px"
                    });
                    maxHeightWrap.each(function(i){
                        maxHeightWrap.eq(i).height(windowHeight - maxHeightWrap.eq(i).offset().top).css("padding-bottom",bottomFixedEle.height()-15);
                    });
                }
                $(window).resize(function() {
                    adaptiveWindow();
                });
                adaptiveWindow();
            },
            resetSearch: function(){
                this.queryFromAirport = "";
                this.queryToAirport = "";
                this.queryStartTime = "";
                this.searchFlights = "";
                this.searchDate = "";
                $(".search-date").val("");
            },
            queryPassengerCallback: function(res){
                let self = this;
                if(res){
                    /*var hasAss = _.find(self.assPassengerList,(l) => {
                        return l.identityNo == res[0].identityNo || l.identityNo == mainId;
                        })
                    if(hasAss){
                        popover.alert({message:"已登记过此人信息，请录入其他关联人"})
                        return;
                    }*/
                    self.queryPassengerInfo =
                    {
                        "ageGroup":"",
                        "allianceCardNo":"",
                        "contact":"",
                        "frequentPassengerCardNo":"",
                        "frequentPassengerClassEN":"",
                        "identityNo":"",
                        "identityType":"",
                        "name":"",
                        "ticketInfos":[]
                    }

                    self.queryPassengerInfo.ageGroup = res[0].ageGroup;
                    self.queryPassengerInfo.allianceCardNo = res[0].allianceCardNo;
                    self.queryPassengerInfo.contact = res[0].contact;
                    self.queryPassengerInfo.frequentPassengerCardNo = res[0].frequentPassengerCardNo;
                    self.queryPassengerInfo.frequentPassengerClassEN = res[0].frequentPassengerClassEN;
                    self.queryPassengerInfo.identityNo = res[0].identityNo;
                    self.queryPassengerInfo.identityType = res[0].identityType;
                    self.queryPassengerInfo.name = res[0].name;

                    res[0]["ticketInfos"].forEach(function(t){
                        if(t.length == 0 || t.ticketNo == ""){
                            self.queryPassengerInfo.ticketInfos = [];
                            popover.alert({message:"未查到客票信息"})
                            return false;
                        }
                        var ticketInfos = {
                            "checked":false,
                            "fromAirportCode":"",
                            "identityNo":"",
                            "name":"",
                            "seatClass":"",
                            "ticketNo":"",
                            "ticketStatus":"",
                            "toAirportCode":""
                        };

                        ticketInfos.fromAirportCode = t.fromAirportCode;
                        ticketInfos.identityNo = t.identityNo || res[0].identityNo;
                        ticketInfos.name = t.name;
                        ticketInfos.seatClass = t.seatClass;
                        ticketInfos.ticketNo = t.ticketNo;
                        ticketInfos.ticketStatus = t.ticketStatus;
                        ticketInfos.toAirportCode = t.toAirportCode;
                        self.queryPassengerInfo.ticketInfos.push(ticketInfos);
                    });

                    console.log(JSON.stringify(self.queryPassengerInfo));
                    sessionStorage.setItem("main_pass_info_" + self.passengerId,JSON.stringify(self.queryPassengerInfo));


                    //render to page
                    self.renderPassInfo(self.queryPassengerInfo);

                    //remove ticket info session
                    sessionStorage.removeItem("ticket_infos_"+res[0].identityNo)
                    //remove same assPassengerList
                    /*self.assPassengerList = _.reject(self.assPassengerList,(l) => {
                        return (l.identityNo == self.queryPassengerInfo.identityNo);
                    });*/
                    //push to assPassengerList
                    var ass_len = self.assPassengerList.length;
                    //has not passenger
                    var hasPassenger = _.find(self.assPassengerList,(l) => {
                            return l.identityNo == self.queryPassengerInfo.identityNo;
                        });

                    console.log(ass_len);
                    console.log(!!hasPassenger);
                    if(ass_len == 0 || hasPassenger){
                        return false
                    }else{
                        self.assPassengerList[ass_len - 1].name = self.queryPassengerInfo.name;
                        self.assPassengerList[ass_len - 1].identityNo = self.queryPassengerInfo.identityNo;
                    }

                    self.$log("assPassengerList");
                    //Adaptive ticket query list height
                    var adaptiveWindow = function(){
                        var
                            maxHeightWrap = $(".scroll-max-height-wrap").not(".scroll-center"),
                            bottomFixedEle = $(".bottom-btn");

                        var targetWidthEle = $(".targetWidth").width();
                        var windowHeight = $(window).height();
                        bottomFixedEle.css({
                            "width":targetWidthEle+1,
                            "left" :50+"px"
                        });
                        maxHeightWrap.each(function(i){
                            maxHeightWrap.eq(i).height(windowHeight - maxHeightWrap.eq(i).offset().top -10).css("padding-bottom",bottomFixedEle.height()-10);
                        });
                    }
                    $(window).resize(function() {
                        adaptiveWindow();
                    });
                    adaptiveWindow();
                }
            },
            queryPassengerTicket:function(){
                var self = this;
                self.ticketsInfoFlag = true;
                var params = {
                    "identityNo": self.passengerId,
                    "name": self.passengerName
                };
                if(params.identityNo == '' && params.name == ''){
                    return false;
                }

                servers.queryPassenger(params,function(res){
                    console.log(res);
                    if(res.length && res.length == 0){
                        popover.alert({message:"查询该人信息为空"})
                        return
                    }
                    self.queryPassengerCallback(res);
                })
            },
            confirmRegistMergeParams: function(flag,callback){
                var self = this;
                //Get the ticket information
                self.$log('queryTicketList');
                var selectedTicket;
                console.log(self.passengerId);

                if(sessionStorage.getItem("ticket_infos_"+self.passengerId)){
                    selectedTicket = JSON.parse(sessionStorage.getItem("ticket_infos_"+self.passengerId))[0];
                }else{
                    selectedTicket = {}
                }
                console.log(selectedTicket);
                /*if(self.queryTicketList.length > 0){
                    self.queryTicketList.forEach(function(t){
                        if(t.checked){
                            selectedTicket = t;
                        }
                    })
                }*/
                var params = {
                    "date":self.airLineInfo.queryDate,
                    "fromAirportCode":self.airLineInfo.queryFromAirport,
                    "toAirportCode":self.airLineInfo.queryToAirport,
                    "requiredSeatClass":self.airLineInfo.airSpace,
                    "flights":self.airLineInfo.queryFlight,
                    "identityType":self.selectedCert,
                    "name":self.passengerName,
                    "contact": self.passengerContact,
                    "frequentPassengerCardNo":self.passengerCardNo,
                    "frequentPassengerClassEN":self.selectedFre,
                    "identityNo":self.passengerId,
                    "specialService":"",
                    "ageGroup":self.selectedPass,
                    "allianceCardNo":self.unionGrade,
                    "comment":self.commentText,
                    "ticket":{
                        "ticketNo":selectedTicket.ticketNo || "",
                        "identityNo":selectedTicket.identityNo || "",
                        "name":selectedTicket.name || "",
                        "seatClass":selectedTicket.seatClass || "",
                        "ticketStatus":selectedTicket.ticketStatus || "",
                        "fromAirportCode":selectedTicket.fromAirportCode || "",
                        "toAirportCode":selectedTicket.toAirportCode || ""
                    }
                };
                if(flag){
                    //Covering the repeating element and null
                    self.commitMultiAlternateData = _.reject(self.commitMultiAlternateData,(d) => {
                            return (d.identityNo == params.identityNo || d.identityNo == "");
                    });
                    self.$log("commitMultiAlternateData");
                    console.log(params);
                    self.commitMultiAlternateData.push(params);
                    self.$log("commitMultiAlternateData");
                    sessionStorage.setItem("commit_multil_alternate_data",JSON.stringify(self.commitMultiAlternateData));
                    callback && callback()
                }else{
                    self.commitAlternateData.push(params);
                    sessionStorage.setItem("commit_alternate_data",JSON.stringify(self.commitAlternateData));
                    callback && callback()
                }

            },
            confirmRegist: function(flag,callback){
                var self = this;

                self.checkTypeInIsComplete(function(flag){
                    //merge registData
                    self.confirmRegistMergeParams(flag,function(){
                        servers.registerCandidates(self.commitMultiAlternateData,function(res){
                            console.log(res);
                            if(+res.resultCode){
                                popover.alert({message:"登记成功"})
                            }else{
                                popover.alert({message:res.resultDescription})
                            }
                            callback && callback();
                            //clear commitMultiAlternateData
                            self.commitMultiAlternateData = [];
                            sessionStorage.removeItem("commit_multi_alternate_data");
                            self.commitAlternateData = [];
                            sessionStorage.removeItem("commit_alternate_data");

                        })
                    })
                });

            },
            GetDateStr : function (AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate()+AddDayCount);
                var y = dd.getFullYear();
                var m = dd.getMonth()+1;
                var d = dd.getDate();
                return y+"-"+(m<10?("0"+m):m)+"-"+(d<10?("0"+d):d);
            }
        },

        ready: function(){

            var self = this;
            var year = new Date().getFullYear();
            var month = new Date().getMonth() + 1;
            var date = new Date().getDate();
            var dateStr = year + "-" + ((month > 9) ? month : ('0' + month)) + "-" + ((date > 9) ? date : ('0' + date));
            if(!sessionStorage.getItem('select_date')){
                sessionStorage.setItem('select_date',dateStr);
                self.queryDate = dateStr;
            }

            var dateInput = $('.form_datetime');
            var startDate = self.GetDateStr(-1);
            var endDate = self.GetDateStr(1);

            dateInput.datetimepicker({
                minView: "month", //选择日期后，不会再跳转去选择时分秒
                language:  'zh',
                format: 'yyyy-mm-dd',
                todayBtn:  1,
                autoclose: 1,
                keyboardNavigation: true,
                startDate: startDate,
                endDate: endDate
            });
            //var selectDate = sessionStorage.getItem('select_date');
            //dateInput.val(dateStr);
            self.searchDate = dateStr;
            dateInput.change(function(){
                var
                        val = $(this).val(),
                // date = ["年","月","日"],
                        newVal = val.split("-"),
                        dateHtml = "";
                for(var i=0;i<newVal.length;i++){
                    // newVal[i] = newVal[i]+date[i];
                    dateHtml +=newVal[i];
                }
                // $(".label-1").html(dateHtml);
                //dateInput.html(val);
                self.searchDate = val;
                //sessionStorage.setItem("select_date",val);
            });
            //pick up timeLine select
            $("body").on("click",function(event){
                if (!$(event.target).hasClass('form-control') && !$(event.target).hasClass('time-select')) {
                    self.startTimeFlag = false;
                    self.endTimeFlag = false;
                }
            })
            var adaptiveWindow = function(){
                var elel = $(".associated-click-hide");
                var needSomeEle = $(".next-btn-click-show");
                var $idCardInput = $(".id-card");
                $idCardInput.focus();
                elel.height($(window).height() - $(".next-list .title").offset().top);
                $(".associated-click-hide .mu-row.text-center").css({
                    "position":"fixed",
                    "left":needSomeEle.offset().left,
                    "bottom":0,
                    "width":needSomeEle.outerWidth(),
                    "background":"#fff"
                })
            }
            $(window).resize(function(){
                if(self.$route.name == "registration"){
                    adaptiveWindow()
                }
            })
            adaptiveWindow();

        }
    }
</script>

<style scoped>
    .plane-search-title{
        box-shadow: 0 2px 5px #eeeff4;
    }
    .plane-search-title .tit{
        color: #4483ea;
        font-size: 16px;
    }
    .plane-search-title span{
        margin-right:15px;
    }
    .ticket-content {
        width: 80%;
        height: 80%;
        margin: 0 auto;
        text-align: left;
        padding-top: 20px;
        /*overflow-y: scroll;*/
        word-break: break-all;
        color: green;
    }
    .ticket-content pre {
        background-color: black !important;
        color: green !important;
        border: none !important;
        font-size: 14px;
    }
    .confirm-box{
        width: 80%;
        height: 80%;
        background-color: black;
    }
    .write{
        line-height:34px;
    }
    .write .onblur-alert{
        width: 90%;
    }
    .requiredFlag {
        color: red;
    }
    .appoint-flight {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 450px;
        display: inline-block;
        line-height: 10px;
    }
    .reset-btn {
        margin-left: 20px;
    }
    .form-control[readonly] {
        background: white;
    }
    .time-select{
        position: absolute;
        top:100%;
        width: 96%;
        height: 200px;
        overflow: auto;
        background: #fff;
        line-height: 30px;
    }
    .time-select li{
        cursor: pointer;
        border-bottom:1px solid #eeeff4;
        padding-left:2em;
    }
    .time-select li:hover{
        background: #eeeff4;
    }
    .buttons.active{
        background: #4483ea;
        color: #fff;
    }
    .call-times input{
        background: url("../assets/images/slide-down.png") no-repeat right 10px center;
    }

    .person-list .scroll-header {
        font-weight: 700;
    }
    .check-box{
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("../assets/images/checked.png") no-repeat right;
        vertical-align: middle;
    }
    .ticketList .single-box{
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-left:20px;
        cursor: context-menu;
    }

    .ticketList .single-box.active {
        background: url("../assets/images/single_select.png") no-repeat center center;
    }
    .mu-row{
        padding-top:10px;
        padding-bottom:10px;
    }
    .padding-row{
        padding-left: 20px;
        padding-right: 20px;
    }
    .main{
        padding:20px 20px 0 20px;
    }
    .first-list, .next-list {
        padding: 10px 0 10px 50px;
        position: relative;
        margin-left: 30px;
    }
    .first-list {
        border-left: 1px solid #4483ea;
    }
    .first-list >img, .next-list >img {
        position: absolute;
        left: -25px;
        top: 0;
    }
    .next-list >img {
        opacity: .6;
    }
    .next-list >img.active{
        opacity: 1;
    }
    .login .title{
        color: #5f646a;
        font-size: 16px;
    }
    .login .title.active{
        color: #4483ea;
    }
    .wrap .mu-row{
        line-height: 34px;
    }
    .warp .btn{
        display: inline-block;
    }
    .associated{
        margin-right:-20px;
        margin-top:-20px;
    }
    .info-title{
        color: #9fa2ab;;
    }
    .modify,.targetWidth{
        position: relative;
    }
    .shortcuts-prompt{
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border:1px solid #eeeff4;
        color:#9fa2ab;
        border-radius: 2px;
        position: absolute;
        right:-10px;
        top:50%;
        margin-top:-10px;
    }
    .targetWidth .shortcuts-prompt{
        right:41%;
    }
    .targetWidth .shortcuts-prompt,
    .modify .shortcuts-prompt{
        display: none;
    }
    .modify .form-control{
        width:90%;
    }
    .absolute{
        position: absolute;
        margin-top:-1px;
        top:0;
        left:90%;
    }
    .tab-menu-list li{
        float: left;
        position: relative;
        margin-left: -20px;
        width: 150px;
        height: 30px;
        line-height: 30px;
        text-indent: 2em;
        background: url("../assets/images/tab_light_1.png") no-repeat;
    }
  .tab-menu-list li .deleteBtn {
      font-size: 25px;
  }

    .tab-menu-list li a{display: inline-block;width: 56%;height: 100%;color: #000;}
    .tab-menu-list .active{z-index: 7;background: url("../assets/images/tabwhite_1.png");}
    .tab-menu-list li:nth-child(1){z-index: 6}
    .tab-menu-list li:nth-child(2){z-index: 5}
    .tab-menu-list li:nth-child(3){z-index: 4}
    .tab-menu-list li:nth-child(4){z-index: 3}
    .tab-menu-list li:nth-child(5){z-index: 2}
    .tab-menu-list li:nth-child(6){z-index: 1}
    .tab-menu-list .item-first{
        margin-left: 0;
    }
    .tab-menu-list .add-ele{
        background: url("../assets/images/tabadd.png") no-repeat;
    }
    .scroll-max-height-wrap{
        border:none;
    }
    .bottom-btn{
        box-shadow: 0 0 7px #e9eaec;
        line-height: 80px;
        background: #fff;
        position: absolute;
        z-index: 777;
        bottom:10px;
        left: 0;
    }
    .modify .dropdown{
        max-height:34px;
    }
    .modify .dropdown .btn{
        padding:6px 12px;
        width: 90%;
        text-align: left;
    }
    body hr{
        margin-top:10px;
    }


    .modify p{
        display: inline-block;
        color: #9fa2ab;
        font-weight: bold;
        margin-right:7px;
    }
    .modify p a{
        vertical-align: middle;
        margin-right:5px;
    }

    .ok-next-one{
        margin-left:10px;
    }

    .child span{
        display: inline-block;
        width: 47px;
        margin-left:-47px;
    }

    .tab-content .mu-row{
        padding-top:5px;
        padding-bottom:5px
    }
    .fixed-bg-opacity{
        background: rgba(0,0,0,.4);
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left: 0;
        z-index: 50;
    }
    .search-box{
        width: 80%;
        height: 80%;
        position: absolute;
        top:0;
        right:0;
        bottom:0;
        left:0;
        margin:auto;
    }
    .form-input{
        line-height: 34px;
    }
    .person-list .col-xs-16{
        line-height: 40px;
    }
    .person-list .col-xs-16.line-two{
        line-height: 20px;
    }
    .search-box >.text-center{
        position: absolute;
        left: 0;
        bottom:0;
        width: 100%;
    }
    .close-btn{
        padding:10px 20px;
        position: absolute;
        right:0;
        top:0;
    }
    .color-gray{
        background-color:#979797
    }
    .btn.color-gray:hover{
        background-color:#979797 !important;
    }
</style>
