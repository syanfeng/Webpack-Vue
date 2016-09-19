
<template>
    <div class="container-fluid">
        <!--Start Left Menu-->
        <left-menu :tabobj='tabObj'></left-menu>
        <!--Left Menu End-->
        <!--Start Right Main-->
        <div class="main col-xs-11 bg-gray">
            <div class="mu-row clearfix date padding-row bg-white">
                <div class="alert-date pull-left">
                    <label for="data-input">
                        <h4>
                            <span class="label-1">{{queryDate}}</span><span class="caret"></span>
                            <input type="text" class="form_datetime form-control" id="data-input">
                        </h4>
                    </label>
                </div>
                <div class="write-time pull-left clearfix">
                    <span class="write-title pull-left">时间</span>
                    <div class="airline clearfix pull-left">
                        <div class="col-xs-5 call-times">
                            <input type="text" class="form-control" placeholder="" v-model="startTimeLine" @click="showStartTimeLine" readonly="true">
                            <ul class="time-select" v-show="startTimeFlag">
                                <li v-for="t in timeLine" track-by="$index" @click="selectStartTime(t)">{{t}}</li>
                            </ul>
                        </div>
                        <div class="split-line"></div>
                        <div class="col-xs-5 call-times pull-right">
                            <input type="text" class="form-control" placeholder="" v-model="endTimeLine" @click="showEndTimeLine" readonly="true">
                            <ul class="time-select" v-show="endTimeFlag">
                                <li v-for="t in timeLine" track-by="$index" @click="selectEndTime(t)">{{t}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="write-airline pull-left clearfix">
                    <span class="write-title pull-left">航线</span>
                    <div class="airline clearfix pull-left">
                        <div class="col-xs-5">
                            <input type="text"
                                   class="form-control"
                                   v-model="searchStartLine"
                                   onkeyup="value=value.replace(/[^a-zA-Z,]/g,'')"
                                   onchange="value=value.replace(/[^a-zA-Z,]/g,'')"
                                   placeholder="出发机场">
                        </div>
                        <div class="split-line"></div>
                        <div class="col-xs-5 pull-right">
                            <input type="text"
                                   class="form-control"
                                   v-model="searchEndLine"
                                   onkeyup="value=value.replace(/[^a-zA-Z,]/g,'')"
                                   onchange="value=value.replace(/[^a-zA-Z,]/g,'')"
                                   placeholder="到达机场">
                        </div>
                    </div>
                </div>
                <div class="header-btn-group pull-left">
                    <button class="btn bg-deep-blue" @click="preciseFilter">筛 选</button>
                    <button class="btn btn-default border-deep-blue" @click="resetFilter">重 置</button>
                </div>
            </div>
            <div class="col-xs-7 main-left bg-white">
                <div class="clearfix search-btn-group">
                    <div class="mu-row clearfix" style="width: 98%;margin: 0 auto;">
                        <div class="clearfix">
                            <button class="btn width-120-big pull-left toggle-bg err"
                                    v-bind:class="{'bg-gray': !isErrTab,'bg-deep-blue': isErrTab}"
                                    @click="showUnusualList">异常航班<span class="abnormal-color">{{uLen}}</span></button>
                            <button class="btn width-120-big pull-left toggle-bg pro middle"
                                    v-bind:class="{'bg-gray': !isProTab,'bg-deep-blue': isProTab}"
                                    @click="showMarkList">我关注的<span class="user-attention-color">{{mLen}}</span></button>
                            <button class="btn bg-gray width-120-big search pull-left"
                                    v-bind:class="{'bg-gray': !isSearchTab,'bg-deep-blue': isSearchTab}"
                                    @click="toggleSearch">
                                <img src="../assets/images/search.png" alt="">
                                搜索
                            </button>
                        </div>
                    </div>
                    <div class="search-slide slide-down bg-white" v-show="isShowSearchTab">
                        <div class="mu-row padding-row clearfix">
                            <div class="col-xs-9">
                                <input autofocus
                                       type="text"
                                       class="form-control"
                                       placeholder='通过" , "字符添加多个航班'
                                       v-model="searchFlight"
                                       onkeyup="value=value.replace(/[^a-zA-Z0-9,]/g,'')"
                                       onchange="value=value.replace(/[^a-zA-Z0-9,]/g,'')"
                                >
                            </div>
                            <div class="col-xs-3" @click="showSearchFlightList()">
                                <button class="btn bg-deep-blue search-button">&nbsp;&nbsp;&nbsp;&nbsp;搜索&nbsp;&nbsp;&nbsp;&nbsp;</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="scroll-max-height-wrap">
                    <div v-if="yesterday" class="morning" data-targetTime="01"
                         v-for="list in yesterdayLists"
                         track-by="$index"
                         v-bind:class="{'quantum':list.length}">
                        <div class="quantum-header-box">
                            <p class="quantum-header" v-show="list.length">
                                <span class="col-xs-2 text-center">{{timeLine[$index]}}</span>
                            </p>
                        </div>
                        <ul class="scroll-row">
                            <li v-for="item in list"
                                track-by="$index"
                                class="mu-row padding-row line-list end-fly"
                                data-planeNum="{{item.flightNo}}"
                                v-bind:class="{
                                    'active':(item.flightStatus == '延误' || item.overSold),
                                    'have-mark':(currentItem && currentItem.flightNo == item.flightNo)
                                }"
                                @click="addDetailsCard(item,$event)">
                                <ul class="scroll-col clearfix">
                                    <li class="col-xs-2 text-center">
                                        {{item.departureTime}}
                                    </li>
                                    <li class="col-xs-2 text-center line-two">
                                        <p>{{item.flightNo}}</p>
                                        <p>{{item.fromAirportCode}} - {{item.toAirportCode}}</p>
                                    </li>
                                    <li class="col-xs-2 text-center flight-status line-two">
                                        <p v-bind:class="{'state': item.flightStatus == '延误'}">{{item.flightStatus}}</p>
                                        <p>{{item.flyStatus}}</p>
                                    </li>
                                    <li :class="{'line-two':item.overSold}"
                                        class="col-xs-2 text-center">
                                        <p class="state" v-show = "item.overSold">超售</p>
                                        <p>{{item.candidatesCount}}候补</p>
                                    </li>
                                    <li class="col-xs-2 text-center line-two flight-focus" v-show="item.isLocked">
                                        <img src="../assets/images/lock.png" alt="">
                                        <p v-show="item.isLocked">{{item.lockedByUser}}</p>
                                        <p v-else>&nbsp;&nbsp;</p>
                                    </li>
                                    <li class="col-xs-2 text-center line-two flight-focus" v-show="item.mark">
                                        <img src="../assets/images/mark.png" alt="">
                                        <p>已关注</p>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="morning" data-targetTime="02"
                         v-for="list in lists"
                         track-by="$index"
                         v-bind:class="{'quantum':list.length}">
                        <div class="quantum-header-box" id="timeLine{{$index}}">
                            <p class="quantum-header" v-show="list.length">
                                <span class="col-xs-2 text-center">{{timeLine[$index]}}</span>
                            </p>
                        </div>
                        <ul class="scroll-row">
                            <li v-for="item in list"
                                track-by="$index"
                                class="mu-row padding-row line-list end-fly"
                                data-planeNum="{{item.flightNo}}"
                                v-bind:class="{
                                    'active':(item.flightStatus == '延误' || item.overSold),
                                    'have-mark':(currentItem && currentItem.flightNo == item.flightNo)
                                }"
                                @click="addDetailsCard(item,$event)">
                                <ul :class="{'nomal-status':(item.flyStatus != '动态取消' && item.flyStatus != '计划取消' && item.flyStatus != '已起飞' && item.flyStatus != '已到达')}"
                                    class="scroll-col clearfix">
                                    <li class="col-xs-2 text-center">
                                        {{item.departureTime}}
                                    </li>
                                    <li class="col-xs-2 text-center line-two">
                                        <p>{{item.flightNo}}</p>
                                        <p>{{item.fromAirportCode}} - {{item.toAirportCode}}</p>
                                    </li>
                                    <li class="col-xs-2 text-center flight-status line-two">
                                        <p v-bind:class="{'state': item.flightStatus == '延误'}">{{item.flightStatus}}</p>
                                        <p>{{item.flyStatus}}</p>
                                    </li>
                                    <li :class="{'line-two':item.overSold}"
                                        class="col-xs-2 text-center">
                                        <p class="state" v-show = "item.overSold">超售</p>
                                        <p>{{item.candidatesCount}}候补</p>
                                    </li>
                                    <li class="col-xs-2 text-center line-two flight-focus" v-show="item.isLocked">
                                        <img src="../assets/images/lock.png" alt="">
                                        <p v-show="item.isLocked">{{item.lockedByUser}}</p>
                                        <p v-else>&nbsp;&nbsp;</p>
                                    </li>
                                    <li class="col-xs-2 text-center line-two flight-focus" v-show="item.mark">
                                        <img src="../assets/images/mark.png" alt="">
                                        <p>已关注</p>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div v-if="tomorrow" class="morning" data-targetTime="03"
                         v-for="list in tomorrowLists"
                         track-by="$index"
                         v-bind:class="{'quantum':list.length}">
                        <div class="quantum-header-box">
                            <p class="quantum-header" v-show="list.length">
                                <span class="col-xs-2 text-center">{{timeLine[$index]}}</span>
                            </p>
                        </div>
                        <ul class="scroll-row">
                            <li v-for="item in list"
                                track-by="$index"
                                class="mu-row padding-row line-list end-fly"
                                data-planeNum="{{item.flightNo}}"
                                v-bind:class="{
                                    'active':(item.flightStatus == '延误' || item.overSold),
                                    'have-mark':(currentItem && currentItem.flightNo == item.flightNo)
                                }"
                                @click="addDetailsCard(item,$event)">
                                <ul class="scroll-col clearfix">
                                    <li class="col-xs-2 text-center">
                                        {{item.departureTime}}
                                    </li>
                                    <li class="col-xs-2 text-center line-two">
                                        <p>{{item.flightNo}}</p>
                                        <p>{{item.fromAirportCode}} - {{item.toAirportCode}}</p>
                                    </li>
                                    <li class="col-xs-2 text-center flight-status line-two">
                                        <p v-bind:class="{'state': item.flightStatus == '延误'}">{{item.flightStatus}}</p>
                                        <p>{{item.flyStatus}}</p>
                                    </li>
                                    <li :class="{'line-two':item.overSold}"
                                        class="col-xs-2 text-center">
                                        <p class="state" v-show = "item.overSold">超售</p>
                                        <p>{{item.candidatesCount}}候补</p>
                                    </li>
                                    <li class="col-xs-2 text-center line-two flight-focus" v-show="item.isLocked">
                                        <img src="../assets/images/lock.png" alt="">
                                        <p v-show="item.isLocked">{{item.lockedByUser}}</p>
                                        <p v-else>&nbsp;&nbsp;</p>
                                    </li>
                                    <li class="col-xs-2 text-center line-two flight-focus" v-show="item.mark">
                                        <img src="../assets/images/mark.png" alt="">
                                        <p>已关注</p>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-xs-5" >
                <div style="padding-left: 20px">
                    <div id="tabs">
                        <!-- Nav tabs -->
                        <ul class="tab-menu-list clearfix bg-gray" role="tablist" v-show="detailsCard.length">
                            <li role="presentation" v-bind:class="{'active':(currentItem && currentItem.flightNo == item.flightNo && currentItem.fromAirportCode == item.fromAirportCode),'item-first':($index == 0)}" v-for="item in detailsCard" track-by="$index" @click="selectCurrentFlight(item)">
                                <a href="#home" aria-controls="home" role="tab" data-toggle="tab">
                                    {{item.flightNo}}
                                    <span class="delete-icon" @click.self="deleteCard(item,$event)"></span>
                                </a>
                            </li>

                        </ul>
                        <!-- Tab panes -->
                        <div class="tab-content bg-black" v-if="detailsCard && detailsCard.length > 0">
                            <div role="tabpanel" class="tab-pane active" id="home">
                                <div class="padding-row margin-top-30 clearfix">
                                    <div class="pull-left">
                                        <h3>{{currentItem.flightNo}}</h3>
                                        <p class="bottom-0">GATE&nbsp;{{currentItem.gate}}</p>
                                    </div>
                                    <div class="pull-right clearfix header-right">
                                        <div class="in-top">
                                            状态 : {{currentItem.flyStatus}}
                                        </div>
                                        <div class="in-bottom clearfix">
                                            <div class="pull-left">
                                                <p class="text-center">{{currentItem.departureTime}}</p>
                                                <p class="text-center">{{currentItem.fromAirportCode}}</p>
                                            </div>
                                            <div class="pull-left icon">
                                                <img src="../assets/images/arrow-left.png" alt="">
                                            </div>
                                            <div class="pull-left">
                                                <p class="text-center">{{currentItem.landingTime}}</p>
                                                <p  class="text-center">{{currentItem.toAirportCode}}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr>
                                <div class="padding-row margin-bottom-30 clearfix mu-relative">
                                    <div class="pull-left clearfix">
                                        <div class="pull-left bottom-left-1">
                                            <p>候补旅客</p>
                                            <h2>{{currentItem.candidatesCount}}</h2>
                                        </div>
                                        <div class="pull-left bottom-left-2">
                                            <p>剩余座位</p>
                                            <h2>{{totalSeats}}

                                            </h2>
                                        </div>
                                        <div class="pull-left bottom-left-2 load-factor">
                                            <p>
                                                <span v-for="s in currentItem.remainSeats"
                                                      track-by="$index">
                                                      {{s.seatType}}:{{s.remainingNumber}}&nbsp;
                                                </span>
                                            </p>
                                        </div>

                                    </div>
                                    <div class="pull-right">
                                        <div class="slide-wrap clearfix" @click="changeFocusMark(currentItem,$event)">
                                            <p class="text">关注</p>
                                            <div class="slide-box" v-bind:class="{'markFlagT':currentItem.mark,'markFlagF':!currentItem.mark}">
                                                <div class="slider"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mu-row bg-white icon-warp clearfix" v-show="currentItem.flyStatus != '计划取消'">
                                    <div class="col-xs-4 n-notice"><a v-link="{name:'inform'}">候补通知</a></div>
                                    <div class="col-xs-4 involuntary"><a v-link="{name:'upgrade'}">非自愿升舱</a></div>
                                    <div class="col-xs-4 limit"><a v-link="{name:'volunteer'}">志愿者选择</a></div>
                                </div>
                                <div class="mu-row bg-white icon-warp clearfix" v-else>
                                    <div class="col-xs-4 n-notice"><a class="font-gray">候补通知</a></div>
                                    <div class="col-xs-4 involuntary"><a class="font-gray">非自愿升舱</a></div>
                                    <div class="col-xs-4 limit"><a class="font-gray">志愿者选择</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--Right Main End-->
    </div>
    <loading></loading>
</template>
<script>
    import Vue from "vue";
    import leftMenu from "./leftMenu.vue";
    import loading from "./loading.vue";
    import _ from "lodash";
    import servers from "../servers.js";
    import popover from "../assets/commonjs/popover.js";

    export default {
        components: {
            leftMenu,
            loading
        },
        http: {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        },
        data: function () {
            return {
                queryDate: sessionStorage.getItem("select_date") || '',
                tabObj: {
                    workbench: true,
                    registration: false,
                    passenger: false
                },

                today: true,
                yesterday: false,
                yesterdayLists:[],
                tomorrow: false,
                tomorrowLists:[],
                isErrTab: false,
                isProTab: false,
                isSearchTab: false,
                isPrecise: false,
                isShowSearchTab: false,
                startTimeFlag: false,
                endTimeFlag: false,
                searchStartLine: 'SHA',
                searchEndLine: '',
                startTimeLine:'',
                endTimeLine:'',
                fromAirportCode: 'SHA',
                rawLists: [],
                lists: [],
                callbackList:[],
                flightInfoObj: {},
                unusualList:[],
                yes_unusualList : [],
                yes_markList : [],
                tom_unusualList : [],
                tom_markList : [],
                uLen : 0,
                mLen : 0,
                markList:[],
                searchFlight:'',
                markFlightNoList: [],
                searchFlightList:[],
                preciseFilterList: [],
                loadFactor:'',
                flightNo: '',
                detailsCard: [],
                currentItem: {"flag": false},
                transBenchArr: [],
                overSoldList: [],
                currentHours:new Date().getHours(),
                timeLine : ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00']
            }
        },
        route:{
            data:function(){
                var self = this;
                self.queryDate = self.GetDateStr(0);
                var timer = function(){
                    self.getTodayFlights(1,function(){
                        //scroll to current timeLine
                        if(self.$route.name == "workbench"){
                            window.location.hash = "#timeLine" + self.currentHours;
                        }
                    })
                };
                timer()

            }
        },

        computed: {
            totalSeats: function(){
                var remainSeats = this.currentItem.remainSeats;
                var num = 0;
                remainSeats.forEach(function(r){
                    num += r.remainingNumber
                });
                return num;
            }
        },
        events: {
            updateList: function(list){
                this.lists = list;
            }
        },
        methods: {
            getOverSoldList:function(l,callback){
                var params = {"date":l.date,"flightNo":l.flightNo,"fromAirportCode":l.fromAirportCode,"toAirportCode":l.toAirportCode};
                servers.getPaxLoadFactor(params,function(res){
                    callback(res)
                })
            },
            GetDateStr : function (AddDayCount) {
                var dd = new Date();
                dd.setDate(dd.getDate()+AddDayCount);
                var y = dd.getFullYear();
                var m = dd.getMonth()+1;
                var d = dd.getDate();
                return y+"-"+(m<10?("0"+m):m)+"-"+(d<10?("0"+d):d);
            },
            otherDayCommonFlightsCallback:function(date,callbackList){
                var self = this;
                self.uLen = 0;
                self.unusualList = [];
                self.mLen = 0;
                self.markList = [];

                callbackList.forEach(function(list){
                    //get uLen
                    if(list.flightStatus == '延误' || list.flyStatus == '计划取消' || list.flyStatus == '动态取消' || list.isOverSold){
                        self.uLen++;
                        self.unusualList.push(list);
                    }
                })

                if(localStorage.getItem("mark_flightNo_list_" + date)){
                    var markFlightNoList = JSON.parse(localStorage.getItem("mark_flightNo_list_"  + date)) || [];
                    markFlightNoList = _.uniq(markFlightNoList);
                    console.log(markFlightNoList);

                    callbackList.forEach(function(list,i){
                        markFlightNoList.forEach(function(m){
                            if(list.flightNo == m){
                                list.mark = true;
                                self.mLen++;
                                self.markList.push(list);
                            }
                        });
                    });
                }
            },
            commonFlightsCallback:function(date,callbackList,flag){
                var self = this;
                console.log(date);

                if(localStorage.getItem("mark_flightNo_list_" + date)){
                    var markFlightNoList = JSON.parse(localStorage.getItem("mark_flightNo_list_"  + date)) || [];
                    markFlightNoList = _.uniq(markFlightNoList);
                    console.log(markFlightNoList);
                    callbackList.forEach(function(list){
                        markFlightNoList.forEach(function(m){
                            if(list.flightNo == m){
                                list.mark = true;
                                self.mLen++;
                                switch(date){
                                    case self.GetDateStr(0):
                                        self.markList.push(list);
                                        self.$log("markList")
                                        break;
                                    case self.GetDateStr(-1):
                                        self.yes_markList.push(list);
                                        self.$log("yes_markList")
                                        break;
                                    case self.GetDateStr(1):
                                        self.tom_markList.push(list);
                                        self.$log("tom_markList")
                                        break;
                                }

                            }
                        })
                    })
                }
                if(flag < 3){
                    _.each(callbackList,(l) => {
                        self.getOverSoldList(l,function(res){
                            l.overSold = res.overSold;
                            l.loadFactor = res.loadFactor;
                            var newCallbackList = callbackList;

                            sessionStorage.setItem('raw_oversold_bench_lists',JSON.stringify(self.callbackList));
                            //self.$nextTick(function(){
                                //get uLen
                                if(l.flightStatus == '延误' || l.flyStatus == '计划取消' || l.flyStatus == '动态取消' || l.isOverSold){

                                    self.uLen++;
                                    switch(date){
                                        case self.GetDateStr(0):
                                            self.unusualList.push(l);
                                            break;
                                        case self.GetDateStr(-1):
                                            self.yes_unusualList.push(l);
                                            break;
                                        case self.GetDateStr(1):
                                            self.tom_unusualList.push(l);
                                            break;
                                    }
                                }

                                switch(flag){
                                        case 1:
                                            if(!self.isErrTab && !self.isProTab && !self.isSearchTab && !self.isPrecise){
                                                switch(date){
                                                    case self.GetDateStr(0):
                                                        self.lists = self.transBenchLists(newCallbackList);
                                                        break;
                                                    case self.GetDateStr(-1):
                                                        self.yesterday = true;
                                                        self.yesterdayLists = self.transBenchLists(newCallbackList);
                                                        break;
                                                    case self.GetDateStr(1):
                                                        self.tomorrow = true;
                                                        self.tomorrowLists = self.transBenchLists(newCallbackList);
                                                        break;
                                                }
                                            }

                                            break;
                                        case 2:
                                            if(self.isErrTab){
                                                switch(date){
                                                    case self.GetDateStr(0):
                                                        self.lists = self.transBenchLists(self.unusualList);
                                                        break;
                                                    case self.GetDateStr(-1):
                                                        self.yes_unusualList = self.transBenchLists(self.unusualList);
                                                        break;
                                                    case self.GetDateStr(1):
                                                        self.tom_unusualList = self.transBenchLists(self.unusualList);
                                                        break;
                                                }
                                            }

                                            break;
                                    }



                            //})
                        })
                    })
                }
            },
            getTodayFlights: function(flag,next){
                var self = this;
                self.yesterday = false;
                self.tomorrow = false;
                self.unusualList = [];
                self.yesterdayLists = [];
                self.tomorrowLists = [];
                self.mLen = 0;
                self.markList = [];
                self.yes_markList = [];
                self.tom_markList = [];


                var fromAirportCode = self.searchStartLine || self.fromAirportCode;
                var toAirportCode = self.searchEndLine || "";

                if(self.today){
                    var date = self.GetDateStr(0);

                    //self.currentHours = 0;
                    self.currentHours = new Date().getHours();
                    console.log(self.currentHours);
                    if(self.currentHours == 4){
                        if(flag < 3){
                            self.uLen = 0;
                        }
                        var params = {"date":date,"fromAirportCode":fromAirportCode,"toAirportCode":toAirportCode,"flights":"","flightStatus":"","startTime":(self.startTimeLine || self.timeLine[self.currentHours - 4]),"endTime":(self.endTimeLine || self.timeLine[23])};
                        servers.getFlights(params,function(res) {
                            self.getFlightsCallback(res);
                            if(flag == 1){
                                self.lists = self.transBenchLists(self.callbackList);
                                sessionStorage.setItem('trans_bench_lists',JSON.stringify(self.lists));
                            }

                            self.commonFlightsCallback(date,self.callbackList,flag);
                            next && next();
                        });

                    }else if(self.currentHours < 4){
                        //Yesterday
                        if(flag < 3){
                            self.uLen = 0;
                        }
                        var date_yes = self.GetDateStr(-1);
                        var _params = {"date":date_yes,"fromAirportCode":fromAirportCode,"toAirportCode":toAirportCode,"flights":"","flightStatus":"","startTime":(self.startTimeLine || self.self.timeLine[self.currentHours+20]),"endTime":(self.endTimeLine || self.timeLine[23])};
                        servers.getFlights(_params,function(res) {
                            self.getFlightsCallback(res);
                            var callbackList = self.callbackList;

                            if(flag == 1){
                                self.yesterdayLists = self.transBenchLists(callbackList);
                            }

                            self.commonFlightsCallback(date_yes,callbackList,flag);

                            // Today
                            var date_today = self.GetDateStr(0);
                            var _params = {"date":date_today,"fromAirportCode":fromAirportCode,"toAirportCode":toAirportCode,"flights":"","flightStatus":"","startTime":(self.startTimeLine || self.timeLine[0]),"endTime":(self.endTimeLine || self.timeLine[self.currentHours+12])};

                            servers.getFlights(_params,function(res){
                                self.getFlightsCallback(res);
                                var callbackList = self.callbackList;
                                if(flag ==1){
                                    self.lists = self.transBenchLists(callbackList);
                                }

                                next && next();
                                self.commonFlightsCallback(date_today,callbackList,flag);
                            })

                        })
                    }else if(self.currentHours > 4){
                        // Today
                        if(flag < 3){
                            self.uLen = 0;
                        }
                        var date_today = self.GetDateStr(0);
                        var _params = {
                            "date": date_today,
                            "fromAirportCode": fromAirportCode,
                            "toAirportCode": toAirportCode,
                            "flights": "",
                            "flightStatus": "",
                            "startTime": (self.startTimeLine || self.timeLine[self.currentHours - 4]),
                            "endTime": (self.endTimeLine || self.timeLine[23])
                        };

                        servers.getFlights(_params,function(res) {
                            self.getFlightsCallback(res);
                            var callbackList = self.callbackList;
                            if(flag == 1){
                                self.lists = self.transBenchLists(callbackList);
                            }
                            self.commonFlightsCallback(date_today,callbackList,flag);
                            //Tomorrow
                            var date_tom = self.GetDateStr(1);
                            var params = {
                                "date":date_tom,
                                "fromAirportCode":fromAirportCode,
                                "toAirportCode":toAirportCode,
                                "flights":"",
                                "flightStatus":"",
                                "startTime":(self.startTimeLine || self.timeLine[0]),
                                "endTime":(self.endTimeLine || self.timeLine[24-self.currentHours]),
                            };

                            servers.getFlights(params, function (res) {
                                self.getFlightsCallback(res);
                                var callbackList = self.callbackList;
                                if(flag==1){
                                    self.tomorrowLists = self.transBenchLists(callbackList);
                                    self.$log("tomorrowLists");
                                }

                                next && next();
                                self.commonFlightsCallback(date_tom,callbackList,flag);
                            })
                        });
                    }
                }
            },
            getFlightsCallback: function(res){
                var self = this;
                self.callbackList = [];
                res = _.sortBy(res,"departureTime");
                res.forEach(function(r){
                    self.flightInfoObj = {
                        "flightNo":"",
                        "date":"",
                        "fromAirportCode":"",
                        "toAirportCode":"",
                        "departureTime":"",
                        "flightStatus":"",
                        "overSold":"",
                        "loadFactor":"",
                        "flyStatus":"",
                        "isLocked":"",
                        "lockedByUser":"",
                        "gate":"",
                        "candidatesCount":"",
                        "mark": false
                    };
                    self.flightInfoObj.flightNo = r.flightNo;
                    self.flightInfoObj.date = r.date;
                    self.flightInfoObj.fromAirportCode = r.fromAirportCode;
                    self.flightInfoObj.toAirportCode = r.toAirportCode;
                    self.flightInfoObj.departureTime = r.departureTime;
                    self.flightInfoObj.landingTime = r.landingTime;
                    self.flightInfoObj.flightStatus = r.flightStatus;
                    self.flightInfoObj.flyStatus = r.flyStatus;
                    self.flightInfoObj.isLocked = r.locked;
                    self.flightInfoObj.lockedByUser = r.lockedByUser;
                    self.flightInfoObj.gate = r.gate;
                    self.flightInfoObj.candidatesCount = r.candidatesCount;
                    self.callbackList.push(self.flightInfoObj);
                });
            },
            toggleSearch: function(){
                var self = this;
                this.isShowSearchTab = !this.isShowSearchTab;
                this.isSearchTab = this.isShowSearchTab;
                this.isErrTab = false;
                this.isProTab = false;
            },
            showUnusualList: function(){
                var self = this;
                self.yesterdayLists = [];
                self.tomorrowLists = [];
                self.lists = [];
                //self.detailsCard = [];
                //self.currentItem = {};
                this.isErrTab = true;
                this.isSearchTab = false;
                this.isProTab = false;
                this.isPrecise = false;
                if(self.today){
                    self.getTodayFlights(2)
                }else{

                    var params = {"date":self.queryDate,"fromAirportCode":self.fromAirportCode,"toAirportCode":"","flights":"","flightStatus":"","startTime":"","endTime":""};

                    servers.getFlights(params,function(res){
                        self.getFlightsCallback(res);
                        self.otherDayCommonFlightsCallback(self.queryDate,self.callbackList);
                        if(self.isErrTab){
                            self.lists = self.transBenchLists(self.unusualList)
                        }
                        _.each(self.unusualList,(u) => {
                            self.getOverSoldList(u,function(res){
                                u.overSold = res.overSold;
                                self.$nextTick(function(){
                                    if(self.isErrTab){
                                        self.lists = self.transBenchLists(self.unusualList)
                                    }
                                })
                            })
                        })
                    })
                }
            },
            showMarkList: function(){
                var self = this;
                self.yesterdayLists = [];
                self.tomorrowLists = [];
                self.lists = [];
                //self.detailsCard = [];
                //self.currentItem = {};
                this.isProTab = true;
                this.isSearchTab = false;
                this.isErrTab = false;
                this.isPrecise = false;

                console.log(99999999);

                if(self.today){
                    self.getTodayFlights(3,function(){
                        self.$log("markList");
                        if(!self.mLen){
                            popover.toast({message:'查询关注航班列表为空'});
                        }
                        if(self.isProTab){
                            self.lists = self.transBenchLists(self.markList)
                            self.yesterdayLists = self.transBenchLists(self.yes_markList);
                            self.tomorrowLists = self.transBenchLists(self.tom_markList);
                        }

                        self.$log("lists");
                        _.each(self.markList,(m) => {
                            self.getOverSoldList(m,function(res){
                                m.overSold = res.overSold;
                                //self.$nextTick(function(){
                                if(self.isProTab){
                                    self.lists = self.transBenchLists(self.markList)
                                }
                               // })
                            })
                        })
                        _.each(self.yes_markList,(m) => {
                            self.getOverSoldList(m,function(res){
                                m.overSold = res.overSold;
                                //self.$nextTick(function(){
                                if(self.isProTab){
                                    self.yesterdayLists = self.transBenchLists(self.yes_markList)
                                }
                                //})
                            })
                        })
                        _.each(self.tom_markList,(m) => {
                            self.getOverSoldList(m,function(res){
                                m.overSold = res.overSold;
                                //self.$nextTick(function(){
                                if(self.isProTab){
                                    self.tomorrowLists = self.transBenchLists(self.tom_markList)
                                }
                                //})
                            })
                        })
                    });
                }else{

                    var params = {"date":self.queryDate,"fromAirportCode":self.fromAirportCode,"toAirportCode":"","flights":"","flightStatus":"","startTime":"","endTime":""};

                    servers.getFlights(params,function(res){
                        self.getFlightsCallback(res);
                        var callbackList = self.callbackList;
                        self.$log("callbackList");
                        self.otherDayCommonFlightsCallback(self.queryDate,self.callbackList);

                        if(!self.mLen){
                            popover.toast({message:'查询关注航班列表为空'});
                        }
                        console.log(555444);
                        self.$log("markList");
                        if(self.isProTab){
                            self.lists = self.transBenchLists(self.markList)
                        }
                        _.each(self.markList,(m) => {
                            self.getOverSoldList(m,function(res){
                                m.overSold = res.overSold;
                                self.$nextTick(function(){
                                    if(self.isProTab){
                                        self.lists = self.transBenchLists(self.markList)
                                    }
                                })
                            })
                        })
                    })
                }


            },
            queryFoucusFlights: function(date,flights,next){
                var self = this;
                var params = {"date":date,"fromAirportCode":"","toAirportCode":"","flights":flights,"flightStatus":"","startTime":"","endTime":""};

                servers.getFlights(params,function(res){
                    console.log(13454);

                    self.getFlightsCallback(res);
                    var callbackList = self.callbackList;
                    self.$log("callbackList");

                    switch(date){
                            case self.GetDateStr(0):
                                self.markList = self.callbackList;
                                self.markList.forEach(function(l){
                                    l.mark = true;
                                })
                                self.$log("markList")
                                self.lists = self.transBenchLists(self.markList);
                                self.$log("lists")
                                break;
                            case self.GetDateStr(-1):
                                console.log(43444444);
                                self.yesterday = true;
                                self.yes_markList = self.callbackList;
                                self.yes_markList.forEach(function(l){
                                    l.mark = true;
                                })
                                self.$log("yes_markList")
                                self.yesterdayLists = self.transBenchLists(self.yes_markList)
                                break;
                            case self.GetDateStr(1):
                                self.tomorrow = true;
                                self.tom_markList = self.callbackList;
                                self.tom_markList.forEach(function(l){
                                    l.mark = true;
                                })
                                self.tomorrowLists = self.transBenchLists(self.tom_markList)
                                break;
                        }

                    next && next();


                })
            },
            /*showMarkList: function(){
             var self = this;
             self.yesterdayLists = [];
             self.tomorrowLists = [];
             self.lists = [];
             self.isProTab = true;
             self.isSearchTab = false;
             self.isErrTab = false;

             console.log(99999999);

             var query_today = self.GetDateStr(0);
             var query_yes = self.GetDateStr(-1);
             var query_tom = self.GetDateStr(1);
             var flights_today = JSON.parse(localStorage.getItem('mark_flightNo_list_' + query_today)) || [];
             var flights_yes = JSON.parse(localStorage.getItem('mark_flightNo_list_' + query_yes)) || [];
             var flights_tom = JSON.parse(localStorage.getItem('mark_flightNo_list_' + query_tom)) || [];
             self.mLen = flights_today.length + flights_yes.length + flights_tom.length;



             if(self.today){
             if(!self.mLen){
             popover.toast({message:'查询关注航班列表为空'});
             return;
             }
             if(flights_today.length != 0){
             self.queryFoucusFlights(query_today,_.uniq(flights_today).join(","),function(){
             if(flights_yes.length != 0){
             self.queryFoucusFlights(query_yes,_.uniq(flights_yes).join(","),function(){
             if(flights_tom.length != 0){
             self.queryFoucusFlights(query_tom,_.uniq(flights_tom).join(","));
             }
             });
             }
             });
             }



             _.each(self.markList,(m) => {
             self.getOverSoldList(m,function(res){
             m.overSold = res.overSold;
             self.$nextTick(function(){
             self.lists = self.transBenchLists(self.markList)
             })
             })
             })
             _.each(self.yes_markList,(m) => {
             self.getOverSoldList(m,function(res){
             m.overSold = res.overSold;
             self.$nextTick(function(){
             self.yesterdayLists = self.transBenchLists(self.yes_markList)
             })
             })
             })
             _.each(self.tom_markList,(m) => {
             self.getOverSoldList(m,function(res){
             m.overSold = res.overSold;
             self.$nextTick(function(){
             self.tomorrowLists = self.transBenchLists(self.tom_markList)
             })
             })
             })
             }else{

             var params = {"date":self.queryDate,"fromAirportCode":self.fromAirportCode,"toAirportCode":"","flights":"","flightStatus":"","startTime":"","endTime":""};
             var paramsjson = JSON.stringify(params);
             var options = {};
             console.log(params);
             options.params = {requestData:paramsjson};
             servers.getFlights(options,function(res){
             self.getFlightsCallback(res);
             self.$log("callbackList");
             self.commonFlightsCallback(self.queryDate,self.callbackList,3);
             if(!self.mLen){
             popover.toast({message:'查询关注航班列表为空'});
             }
             self.lists = self.transBenchLists(self.markList);
             _.each(self.markList,(m) => {
             self.getOverSoldList(m,function(res){
             m.overSold = res.overSold;
             self.$nextTick(function(){
             self.lists = self.transBenchLists(self.markList)
             })
             })
             })
             })
             }
             },*/
            showSearchFlightList: function(){
                var self = this;
                this.isSearchTab = true;
                this.isProTab = false;
                this.isErrTab = false;
                this.isPrecise = false;
                self.yesterdayLists = [];
                self.tomorrowLists = [];
                //self.detailsCard = [];
                self.searchFlight = self.searchFlight.toUpperCase();
                var params = {"date":self.queryDate,"fromAirportCode":"","toAirportCode":"","flights":self.searchFlight,"flightStatus":"","startTime":"","endTime":""};
                servers.getFlights(params,function(res){
                    if(res.length == 0){
                        popover.toast({message:"未查询到指定航班"})
                    }
                    self.getFlightsCallback(res);
                    var callbackList = self.callbackList;
                    self.commonFlightsCallback(self.queryDate,callbackList);
                    self.$log("callbackList");
                    if(self.isSearchTab){
                        self.isShowSearchTab = false;
                        self.lists = self.transBenchLists(callbackList);
                    }

                    _.each(callbackList,(m) => {
                        self.getOverSoldList(m,function(res){
                            m.overSold = res.overSold;
                            self.lists = self.transBenchLists(callbackList)
                        })
                    })
                });
            },
            showStartTimeLine: function(){
                this.startTimeFlag = !this.startTimeFlag
            },
            showEndTimeLine: function(){
                this.endTimeFlag = !this.endTimeFlag
            },
            selectStartTime: function(t){
                this.startTimeLine = t;
                this.startTimeFlag = false;
            },
            selectEndTime: function(t){
                this.endTimeLine = t;
                this.endTimeFlag = false;
            },
            resetFilter: function(){
                this.searchStartLine = '';
                this.searchEndLine = '';
                this.startTimeLine = '';
                this.endTimeLine = '';
            },
            preciseFilter: function(){
                var self = this;
                self.isProTab = false;
                self.isSearchTab = false;
                self.isErrTab = false;
                self.isPrecise = true;
                self.yesterdayLists = [];
                self.tomorrowLists = [];
                self.lists = [];
                //self.detailsCard = [];
                //self.currentItem = {};
                self.searchStartLine = self.searchStartLine.toUpperCase();
                self.searchEndLine = self.searchEndLine.toUpperCase();
                var params = {
                    "date":self.queryDate,
                    "fromAirportCode":self.searchStartLine,
                    "toAirportCode":self.searchEndLine,
                    "flights":"",
                    "flightStatus":"",
                    "startTime":self.startTimeLine,
                    "endTime":self.endTimeLine
                };

                servers.getFlights(params,function(res){
                    if(res.length == 0){
                        popover.toast({message:"未查询到航班列表"})
                    }
                    self.getFlightsCallback(res);
                    var callbackList = self.callbackList;
                    self.otherDayCommonFlightsCallback(self.queryDate,callbackList);
                    if(self.isPrecise){
                        self.lists = self.transBenchLists(callbackList);
                    }
                    _.each(callbackList,(m) => {
                        self.getOverSoldList(m,function(res){
                            m.overSold = res.overSold;
                            if(self.isPrecise){
                                self.lists = self.transBenchLists(callbackList);
                            }
                        })
                    })
                });
            },
            selectCurrentFlight: function(item){
                var self = this;
                var flightObj = {
                    "flag": false,
                    "mark": false,
                    "flightNo":"",
                    "date":"",
                    "fromAirportCode":"",
                    "toAirportCode":"",
                    "departureTime":"",
                    "flightStatus":"",
                    "overSold":"",
                    "flyStatus":"",
                    "isLocked":"",
                    "lockedByUser":"",
                    "gate":"",
                    "candidatesCount":"",
                    "remainSeats":[]
                };
                var params = {"date":item.date,"flightNo":item.flightNo,"fromAirportCode":item.fromAirportCode,"toAirportCode":item.toAirportCode};

                servers.getFlight(params,function(res) {
                    flightObj.flightNo = res.flightNo;
                    flightObj.date = res.date;
                    flightObj.fromAirportCode = res.fromAirportCode;
                    flightObj.toAirportCode = res.toAirportCode;
                    flightObj.departureTime = res.departureTime;
                    flightObj.landingTime = res.landingTime;
                    flightObj.flightStatus = res.flightStatus;
                    flightObj.overSold = res.overSold;
                    flightObj.flyStatus = res.flyStatus;
                    flightObj.isLocked = res.locked;
                    flightObj.lockedByUser = res.lockedByUser;
                    flightObj.gate = res.gate;
                    flightObj.candidatesCount = res.candidatesCount;
                    flightObj.remainSeats = [];
                    //flightObj.flag = true;
                    console.log(flightObj);
                    item.flightStatus = flightObj.flightStatus;
                    item.flyStatus = flightObj.flyStatus;
                    self.currentItem = flightObj;
                    var markFlightNoList = JSON.parse(localStorage.getItem('mark_flightNo_list_' + item.date)) || [];

                    _.each(markFlightNoList,(m) => {
                        if(m == item.flightNo){
                            self.currentItem.mark = true
                        }
                    })

                    console.log(JSON.stringify(self.currentItem));
                    sessionStorage.setItem('current_item',JSON.stringify(self.currentItem));
                    //getRemainSeats
                    servers.getRemainSeats(params,function(res){
                        res.remainSeats.forEach((r) => {
                            var remainSeatsObj = {
                                "remainingNumber":"",
                                "seatType":""
                            };
                            remainSeatsObj.remainingNumber = r.remainingNumber;
                            remainSeatsObj.seatType = r.seatType;
                            console.log(remainSeatsObj);
                            console.log(self.currentItem.remainSeats);
                            self.currentItem.remainSeats.push(remainSeatsObj);
                            //getPaxLoadFactor and overSold
                            servers.getPaxLoadFactor(params,function(res){
                                //self.loadFactor = res.loadFactor;
                                item.overSold = res.overSold;
                                item.loadFactor = res.loadFactor;
                            })
                        })
                    })
                })
            },
            addDetailsCard: function(item,event){
                event.stopPropagation();
                var self = this;
                /*var $li = $(".tab-menu-list > li");
                var liLen = $li.length;
                $li.each(function(index,el){
                    $(el).removeClass("active")
                });*/
                //$($li[liLen - 1]).addClass("active");
                var cardShowFlag = false;
                var flightObj = {
                    "flag": false,
                    "mark": false,
                    "flightNo":"",
                    "date":"",
                    "fromAirportCode":"",
                    "toAirportCode":"",
                    "departureTime":"",
                    "flightStatus":"",
                    "overSold":"",
                    "flyStatus":"",
                    "isLocked":"",
                    "lockedByUser":"",
                    "gate":"",
                    "candidatesCount":"",
                    "remainSeats":[]
                };
                //var flightObj = {"candidatesCount":0,"flyStatus":"","date":"","departureTime":"","flightNo":"","flightStatus":"","fromAirportCode":"","gate":"","landingTime":"","locked":false,"lockedByUser":"","overSold":false,"remainSeats":[{"remainingNumber":14,"seatType":"F"},{"remainingNumber":10,"seatType":"C"},{"remainingNumber":17,"seatType":""}],"toAirportCode":"","flag":false};
                $(".scroll-max-height-wrap").find("li").removeClass("have-mark");
                if(event) $(event.currentTarget).addClass("have-mark");

                var params = {"date":item.date,"flightNo":item.flightNo,"fromAirportCode":item.fromAirportCode,"toAirportCode":item.toAirportCode};
                //getFlight
                servers.getFlight(params,function(res){
                    flightObj.flightNo = res.flightNo;
                    flightObj.date = res.date;
                    flightObj.fromAirportCode = res.fromAirportCode;
                    flightObj.toAirportCode = res.toAirportCode;
                    flightObj.departureTime = res.departureTime;
                    flightObj.landingTime = res.landingTime;
                    flightObj.flightStatus = res.flightStatus;
                    flightObj.overSold = res.overSold;
                    flightObj.flyStatus = res.flyStatus;
                    flightObj.isLocked = res.locked;
                    flightObj.lockedByUser = res.lockedByUser;
                    flightObj.gate = res.gate;
                    flightObj.candidatesCount = res.candidatesCount;
                    flightObj.remainSeats = [];

                    //flightObj.flag = true;
                    console.log(flightObj);
                    item.flightStatus = flightObj.flightStatus;
                    item.flyStatus = flightObj.flyStatus;

                    //lockFlight
                    servers.lockFlight(params,function(res){
                        console.log(res);
                        // lock this flightNo
                        item.isLocked = true;
                        // update currentItem
                        self.detailsCard.forEach(function(d){
                            if(d.flightNo == item.flightNo && d.fromAirportCode == item.fromAirportCode){
                                cardShowFlag = true;
                                return false;
                            }
                        });
                        if(!cardShowFlag){
                            self.detailsCard.push(flightObj)
                        }
                        self.currentItem = flightObj;
                        self.currentItem.mark = item.mark;
                        console.log(JSON.stringify(self.currentItem));
                        sessionStorage.setItem('current_item',JSON.stringify(self.currentItem));


                        //getRemainSeats
                        servers.getRemainSeats(params,function(res){
                            res.remainSeats.forEach((r) => {
                                var remainSeatsObj = {
                                    "remainingNumber":"",
                                    "seatType":""
                                };
                                remainSeatsObj.remainingNumber = r.remainingNumber;
                                remainSeatsObj.seatType = r.seatType;
                                console.log(remainSeatsObj);
                                console.log(self.currentItem.remainSeats);
                                self.currentItem.remainSeats.push(remainSeatsObj);

                                console.log(JSON.stringify(self.currentItem));
                                sessionStorage.setItem('current_item',JSON.stringify(self.currentItem));

                                //getPaxLoadFactor and overSold
                                servers.getPaxLoadFactor(params,function(res){
                                    //self.loadFactor = res.loadFactor;
                                    item.overSold = res.overSold;
                                    item.loadFactor = res.loadFactor;
                                });
                            })
                        })
                    })
                })
            },

            changeFocusMark: function(item){
                var self = this;
                var dateMark = function(lists){
                    lists.forEach(function(list){
                        _.each(list,(l) => {
                            if(item.flightNo == l.flightNo){
                                l.mark = item.mark;
                                item.mark ? markFlightNoList.push(item.flightNo) : markFlightNoList.$remove(item.flightNo);
                            }
                        })
                    });
                };
                item.mark = !item.mark;
                var markFlightNoList = JSON.parse(localStorage.getItem('mark_flightNo_list_' + item.date)) || [];
                if(self.today){
                    switch(item.date){
                        case self.GetDateStr(0):
                            dateMark(self.lists);
                            break;
                        case self.GetDateStr(-1):
                            dateMark(self.yesterdayLists);
                            break;
                        case self.GetDateStr(1):
                            dateMark(self.tomorrowLists);
                            break;
                    }
                }else{
                    dateMark(self.lists)
                }



                if(item.mark){
                    self.mLen++
                }else{
                    self.mLen--
                }
                console.log(markFlightNoList);
                _.uniq(markFlightNoList);
                console.log(markFlightNoList);
                localStorage.setItem('mark_flightNo_list_' + item.date,JSON.stringify(markFlightNoList)) || [];
            },

            deleteCard: function(item,event){
                event.stopPropagation();
                var self = this;

                //unlockFlight
                var _params = {"date":item.date,"flightNo":item.flightNo};
                servers.unlockFlight(_params,function(res){
                    var unLockFlight = item.flightNo;
                    if(self.today){
                        switch(item.date){
                            case self.GetDateStr(0):
                                self.lists.forEach(function(list){
                                    list.forEach(function(l){
                                        if(l.flightNo == unLockFlight){
                                            l.isLocked = false;
                                        }
                                    })
                                })
                                break;
                            case self.GetDateStr(-1):
                                self.yesterdayLists.forEach(function(list){
                                    list.forEach(function(l){
                                        if(l.flightNo == unLockFlight){
                                            l.isLocked = false;
                                        }
                                    })
                                })
                                break;
                            case self.GetDateStr(1):
                                self.tomorrowLists.forEach(function(list){
                                    list.forEach(function(l){
                                        if(l.flightNo == unLockFlight){
                                            l.isLocked = false;
                                        }
                                    })
                                })
                                break;
                        }
                    }else{
                        self.lists.forEach(function(list){
                            list.forEach(function(l){
                                if(l.flightNo == unLockFlight){
                                    l.isLocked = false;
                                }
                            })
                        })
                    }
                })
                self.detailsCard.$remove(item);
                self.$log("detailsCard");
                var detailsCardLength = self.detailsCard.length;

                if(self.detailsCard.length == 0){
                    self.currentItem = {};
                }else{
                    self.currentItem = self.detailsCard[detailsCardLength - 1];
                }
            },

            transBenchLists: function(lists){
                var arr = [];
                var arr1 = [],arr2=[],arr3=[],arr4=[],arr5=[],arr6=[],arr7=[],arr8=[],
                    arr9=[],arr10=[],arr11=[],arr12=[],arr13=[],arr14=[],arr15=[],arr16=[],
                    arr17=[],arr18=[],arr19=[],arr20=[],arr21=[],arr22=[],arr23=[],arr24=[];

                lists.forEach(function(list){
                    if(list.departureTime >= "00:00" && list.departureTime < "01:00"){
                        arr1.push(list);
                    }else if(list.departureTime >= "01:00" && list.departureTime < "02:00"){
                        arr2.push(list);
                    }else if(list.departureTime >= "02:00" && list.departureTime < "03:00"){
                        arr3.push(list);
                    }else if(list.departureTime >= "03:00" && list.departureTime < "04:00"){
                        arr4.push(list);
                    }else if(list.departureTime >= "04:00" && list.departureTime < "05:00"){
                        arr5.push(list);
                    }else if(list.departureTime >= "05:00" && list.departureTime < "06:00"){
                        arr6.push(list);
                    }else if(list.departureTime >= "06:00" && list.departureTime < "07:00"){
                        arr7.push(list);
                    }else if(list.departureTime >= "07:00" && list.departureTime < "08:00"){
                        arr8.push(list);
                    }else if(list.departureTime >= "08:00" && list.departureTime < "09:00"){
                        arr9.push(list);
                    }else if(list.departureTime >= "09:00" && list.departureTime < "10:00"){
                        arr10.push(list);
                    }else if(list.departureTime >= "10:00" && list.departureTime < "11:00"){
                        arr11.push(list);
                    }else if(list.departureTime >= "11:00" && list.departureTime < "12:00"){
                        arr12.push(list);
                    }else if(list.departureTime >= "12:00" && list.departureTime < "13:00"){
                        arr13.push(list);
                    }else if(list.departureTime >= "13:00" && list.departureTime < "14:00"){
                        arr14.push(list);
                    }else if(list.departureTime >= "14:00" && list.departureTime < "15:00"){
                        arr15.push(list);
                    }else if(list.departureTime >= "15:00" && list.departureTime < "16:00"){
                        arr16.push(list);
                    }else if(list.departureTime >= "16:00" && list.departureTime < "17:00"){
                        arr17.push(list);
                    }else if(list.departureTime >= "17:00" && list.departureTime < "18:00"){
                        arr18.push(list);
                    }else if(list.departureTime >= "18:00" && list.departureTime < "19:00"){
                        arr19.push(list);
                    }else if(list.departureTime >= "19:00" && list.departureTime < "20:00"){
                        arr20.push(list);
                    }else if(list.departureTime >= "20:00" && list.departureTime < "21:00"){
                        arr21.push(list);
                    }else if(list.departureTime >= "21:00" && list.departureTime < "22:00"){
                        arr22.push(list);
                    }else if(list.departureTime >= "22:00" && list.departureTime < "23:00"){
                        arr23.push(list);
                    }else if(list.departureTime >= "23:00" && list.departureTime < "24:00"){
                        arr24.push(list);
                    }
                });
                arr.push(arr1,arr2,arr3,arr4,arr5,arr6,arr7,arr8,arr9,arr10,arr11,arr12,arr13,arr14,arr15,arr16,arr17,arr18,arr19,arr20,arr21,arr22,arr23,arr24);
                return arr;
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

            if(self.queryDate != dateStr){
                self.today = false
            }else{
                self.today = true
            }

            $('.form_datetime').datetimepicker({
                minView: "month", //选择日期后，不会再跳转去选择时分秒
                language:  'zh-CN',
                format: 'yyyy-mm-dd',
                todayBtn:  1,
                autoclose: 1
            });

            $("#data-input").change(function(){
                self.$nextTick(function(){
                    self.isProTab = false;
                    self.isSearchTab = false;
                    self.isErrTab = false;
                })

                self.currentItem = [];
                self.detailsCard = [];
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
                $(".label-1").html(val);
                self.queryDate = val;
                sessionStorage.setItem("select_date",val);

                if(self.queryDate != dateStr){
                    self.today = false;
                }else{
                    self.today = true;
                }

                if(self.today){
                    self.getTodayFlights(1,function(){
                        //scroll to current timeLine
                        if(self.$route.name == "workbench"){
                            window.location.hash = "#timeLine" + self.currentHours;
                        }
                    });
                }else{
                    self.yesterday = false;
                    self.tomorrow = false;
                    self.lists = [];
                    self.yesterdayLists = [];
                    self.tomorrowLists = [];
                    self.mLen = 0;
                    self.uLen = 0;
                    self.unusualList = [];
                    self.markList = [];
                    self.yes_unusualList = [];
                    self.tom_unusualList = [];
                    self.yes_markList = [];
                    self.tom_markList = [];
                    self.$nextTick(function(){
                        var params = {"date":self.queryDate,"fromAirportCode":self.fromAirportCode,"toAirportCode":"","flights":"","flightStatus":"","startTime":"","endTime":""};
                        servers.getFlights(params,function(res){
                            self.getFlightsCallback(res);
                            var callbackList = self.callbackList;

                            //self.commonFlightsCallback(self.queryDate,self.callbackList,1)
                            self.otherDayCommonFlightsCallback(self.queryDate,callbackList);
                            self.lists = self.transBenchLists(callbackList);
                            //scroll to current timeLine
                            if(self.$route.name == "workbench"){
                                window.location.hash = "#timeLine" + self.currentHours;
                            }
                            _.each(callbackList,(l)=>{
                                self.getOverSoldList(l,function(res){
                                    l.overSold = res.overSold;
                                    self.$nextTick(function(){
                                        self.lists = self.transBenchLists(callbackList)
                                    })
                                })
                            })
                        })
                    })
                }
            });

            //pick up timeLine select
            $("body").on("click",function(event){
                if (!$(event.target).hasClass('form-control') && !$(event.target).hasClass('time-select')) {
                    self.startTimeFlag = false;
                    self.endTimeFlag = false;
                }
            });

            //Adaptive to window size
            var adaptiveWindow = function(){
                var maxHeightWrap = $(".scroll-max-height-wrap");
                var windowHeight = $(window).height();
                maxHeightWrap.each(function(i){
                    maxHeightWrap.eq(0).height(windowHeight - maxHeightWrap.eq(0).offset().top-20);
                    maxHeightWrap.eq(1).height(windowHeight - maxHeightWrap.eq(0).offset().top-10);
                });
            }
            $(window).resize(function() {
                if(self.$route.name == "workbench"){
                    adaptiveWindow();
                }
            });
            adaptiveWindow();

        }
    }


</script>
<style scoped>
    .border-deep-blue {
        color: #4483ea;
    }
    .nomal-status {
        color: #333 !important;
    }
    .font-gray{
        color: #666 !important;
    }

    .load-factor {
        margin-top: 20px;
    }
    img {
        vertical-align: middle !important;
    }
    .line-list:hover{
        background: #eeeff4 !important;
    }
    .col-xs-5 .scroll-row >li:hover{
        border:1px solid #000 ;
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
    /*tabs*/
    .tab-menu-list li{
        float: left;
        position: relative;
        /*margin-left: -20px;*/
        width: 150px;
        height: 30px;
        line-height: 30px;
        text-indent: 2em;
        background: url("../assets/images/tab_light.png") no-repeat;
    }
    .tab-menu-list li:nth-child(1){z-index: 7}
    .tab-menu-list li:nth-child(2){z-index: 6}
    .tab-menu-list li:nth-child(3){z-index: 5}
    .tab-menu-list li:nth-child(4){z-index: 4}
    .tab-menu-list li:nth-child(5){z-index: 3}
    .tab-menu-list .item-first{
        margin-left: 0;
    }
    .date{
        border-bottom:1px solid #eeeff4;
    }
    .date h4{
        font-weight: bold;
        line-height: 50px;
    }
    .prompt{
        border-left: 1px solid #eeeff4;
        padding-left: 40px;
        position: relative;
        line-height: 55px;
    }
    .prompt span{
        position: absolute;
        left: 0;
        top:50%;
        margin-top:-7px;
    }
    .prompt >.col-xs-6:nth-child(2){
        /*padding-left: 15px;*/
    }
    .abnormal,.user-attention{
        width: 10px;
        height: 10px;
        margin-left: -15px;
        display: block;
        border-radius: 100%;
    }
    .abnormal{
        background: #fe5b48;
    }
    .abnormal-color{color: #fe5b48;}
    .user-attention{
        background: #deb871;
    }
    .user-attention-color{color: #deb871;}
    .abnormal-color,.user-attention-color{
        margin-left: 3px;
    }

    .bottom{
        bottom:5px;
    }
    .scroll-max-height-wrap{
        border-top:0 none;
    }
    .quantum{
        border-top:1px solid #eeeff4;
    }
    .quantum-header-box{
        position: relative;
    }
    .quantum-header{
        height: 30px;
        line-height: 30px;
        width: 98%;
        /*background: #eeeff4;*/
        margin: 0 auto;
        border-top:2px solid #eeeff4;
        border-bottom:1px solid #eeeff4;
    }
    .quantum-header span{
        position: absolute;
        left: 16px;
    }
    .scroll-row .have-mark{
        border-left:2px solid #4377cb;
        background: #ecf0f9;
    }
    .morning .scroll-row >.active{
        border-left: 2px solid #fd5c48;
        background: #fef3f1;
    }
    .morning .scroll-row >.active .state{
        color: #fd5c48;
    }
    .afternoon .scroll-row >.active{
        border-left: 2px solid #ddb770;
        background: #f8f3ed;
    }
    .afternoon .scroll-row >.active .state{
        color: #ddb770;
    }
    .scroll-col li{
        line-height: 58px;
    }
    .scroll-col .line-two{
        line-height: 29px;
    }

    /*Main Right Tabs*/


    .tab-menu-list li a{display: block;width: 100%;height: 100%;color: #000;background: url("../assets/images/closedark.png") no-repeat 110px center;}
    .tab-menu-list .active{z-index: 7;background: url("../assets/images/tab_dark.png");}
    .tab-menu-list a{color: #000;display: block;position: relative;line-height: 30px;}
    .delete-icon{
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url("../assets/images/closedark.png") no-repeat center center;
        position: absolute;
        right: 20px;
    }
    .tab-menu-list .active .delete-icon{background-image: url("../assets/images/closelight.png");}
    .tab-menu-list .active a{color: #fff;}


    .tab-content{
        color: #fff;
    }
    .header-right .pull-left{
        margin-left: 25px;
    }
    .header-right .pull-left.icon{
        margin-top:8px;
    }
    .margin-30{
        padding-top:20px;
        padding-bottom:20px;
    }

    .slide-wrap{
        position: absolute;
        right:20px;
        bottom:30px;
    }
    .slide-wrap .text{
        display: inline-block;
        margin-right:15px;
    }
    .slide-box{
        width: 100px;
        height: 40px;
        padding:3px;
        background: #D5B783;
        position: relative;
        display: inline-block;
        vertical-align: middle;
    }
    .slider{
        width: 47px;
        height: 34px;
        position: absolute;right: 3px;
        background: #fff;
    }
    .markFlagF {
        background: rgb(59, 59, 61);
    }
    .markFlagF .slider {
        right: 50px;
    }

    .markFlagT {
        background-color: #D5B783;

    }
    .markFlagT .slider {
        right: 3px;
    }
    .tab-content{
        font-size: 14px;
    }
    .tab-content h3{
        font-size: 36px;
    }
    .tab-content .pull-left p.bottom-0{
        position: absolute;
        bottom:0;
    }
    .bottom-left-1 h2,.bottom-left-2 h2{
        font-size: 36px;
    }
    .bottom-left-1{color: #c6a66b;margin-right: 25px;}
    .bottom-left-2{color: #5db0a6;border-left: 1px solid #36353a;padding-left:25px;}
    .bottom-left-2 small{color: #5db0a6;margin-left: 27px;font-size: 14px;}
    .right-footer h3{
        font-size: 18px;
        line-height: 40px;
    }

    .date label{
        position: relative;
    }
    #data-input{
        position: absolute;
        left: 0;
        top:100%;
        background: transparent;
        height: 0;
        width: 0;
        outline: none;
        border: none;
        padding: 0;
    }


    .search-btn-group{
        position: relative;
    }
    .slide-down{
        width: 100%;
        border-bottom:1px solid #eeeff4;
        border-top:1px solid #eeeff4;
        position: absolute;
        top:100%;
        left:0;
        z-index: 66;
    }
    .query-slide input{
        width: 96%;
    }
    .query-slide .col-xs-6 button{
        width: 96%;
    }
    .m-b{
        margin-bottom:10px;
    }

    .time-select{
        position: absolute;
        z-index: 99;
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



    .six-wrap{width: 50%;}
    .five-wrap{width: 47%;}
    .width-120-big{
        width: 32.3333%;
    }
    .middle{
        margin:0 1.5%;
    }
    hr.col-xs-12{
        margin-top:15px;
    }


    .airline{
        position: relative;
    }
    .airline .split-line{
        position: absolute;
        width: 5%;
        height: 1px;
        background: #eeeff4;
        left:50%;
        top:50%;
        margin-top:-1px;
        margin-left:-2.5%;
    }


    .end-fly{
        color: #7D818A;
    }


    .icon-warp{
        border-top:15px solid #eeeff4;
        border-bottom:15px solid #eeeff4;
    }
    .icon-warp .col-xs-4{
        padding-left: 10px;
        padding-right:10px;
        text-align: center;
    }
    .icon-warp .col-xs-4 a{
        display: block;
        background-repeat: no-repeat;
        background-position: left bottom;
        background-color: #eeeff4;
        padding:40px 0;
        font-size: 18px;
    }
    .icon-warp .col-xs-4 a:hover{
        font-weight: bold;
    }
    .n-notice a{
        background-image: url("../assets/images/notice-big.png");
        color: #4276ca;
    }
    .involuntary a{
        background-image: url("../assets/images/upgrade.png");
        color: #4276ca;
    }
    .limit a{
        background-image: url("../assets/images/aviod.png");
        color: #4276ca;
    }
    .in-bottom >div:nth-child(1){
        margin-left: 0;
    }
    .margin-top-30{
        padding-top:30px;
        position: relative;
    }
    .margin-bottom-30{
        padding-bottom:30px;
        position: relative;
    }
    .tab-pane >hr{
        margin:30px 20px;
        border-top: 1px solid #4d5056;
    }
    .font-size-18{
        font-size: 18px;
    }
    .btn-group .btn{
        height: 40px;
    }
    .flight-status{
        width: 20%;
    }
    .flight-focus {
        width: 15% !important;
    }
    .date{
        margin-bottom:20px;
    }
    .date .form-control{
        display: inline-block;
    }
    .alert-date{
        margin-right:20px;
    }
    .alert-date label{
        cursor: pointer;
    }
    .write-time,.write-airline,.header-btn-group{
        line-height: 55px;
        margin-left: 15px;
    }
    .write-airline{
        margin-left:30px;
    }
    .header-btn-group{
        margin-left:25px;
    }
    .write-title,.header-btn-group button{
        margin-right:10px;
    }

    .airline .col-xs-5{
        width: 47%;
    }
    .write-time,.write-airline{
        width: 30%;
    }
    .write-time span,.write-airline span{
        width: 10%;
    }
    .write-time .airline,.write-airline .airline{
        width: 85%;
    }
</style>
