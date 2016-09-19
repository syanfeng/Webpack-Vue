<template>
    <div class="container-fluid">
        <!--Start Left Menu-->
        <menu :tabobj='tabObj'></menu>
        <!--Left Menu End-->
        <!--Start Right Main-->
        <div class="main col-xs-11 bg-gray">
            <div class="main-header bg-black clearfix">
                <h2 class="pull-left">{{currentItem.flightNo}} 志愿者选择</h2>
                <div class="pull-left clearfix margin-left-202">
                    <div class="pull-left bottom-left-2">
                        <p>
                            剩余座位：{{totalSeats}}&nbsp;
                            <span
                                v-for="s in currentItem.remainSeats"
                                track-by="$index">
                                {{s.seatType}}:{{s.remainingNumber}}&nbsp;
                            </span>
                        </p>
                    </div>
                </div>
                <a v-link="{'name':'workbench'}" class="pull-right close-page"><img src="../assets/images/closelight2@.png" alt=""></a>
                <div class="association-passengers pull-right hide" @click="showAssociaInfo">
                    <div class="btn-group">
                        <button class="btn  bg-light-blue"><img src="../assets/images/link.png" alt=""></button>
                        <button class="btn  bg-deep-blue">同行关联</button>
                    </div>
                </div>
            </div>
            <div class="clearfix bg-white">
                <div class="select-passenger clearfix mu-row padding-row">
                    <div class="dropdown pull-left">
                        <button class="btn btn-default dropdown-toggle width-140 bg-gray" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            {{seatChecked}}
                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <li v-for="s in seats" track-by="$index" @click="checkSeat(s,$event)">{{s}}</li>
                        </ul>
                    </div>
                    <div class="dropdown pull-left">
                        <button class="btn btn-default dropdown-toggle width-140 bg-gray" type="button" id="dropdownMenu4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            {{gradeChecked}}
                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu4">
                            <li v-for="g in grades" track-by="$index" @click="checkGrade(g,$event)">{{g}}</li>
                        </ul>
                    </div>
                    <div class="dropdown pull-left">
                        <button class="btn btn-default dropdown-toggle width-140 bg-gray" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            {{volunteerChecked}}
                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu3">
                            <li v-for="v in volunteers" track-by="$index" @click="checkVolunteerStatus(v,$event)">{{v}}</li>
                        </ul>
                    </div>
                    <div class="search-wrap pull-right clearfix">
                        <input type="text" placeholder="姓名" class="pull-left" v-model="queryName">
                        <img src="../assets/images/delete.png" class="delete-btn" v-show="queryName" @click="deleteQueryName">
                        <button class="btn pull-left bg-deep-blue" @click="searchNameInfo">搜 索</button>
                    </div>
                </div>
                <div class="select-end-create-icon mu-row padding-row clearfix">
                    <p class="icon bg-deep-blue" v-for="(key,item) in searchTerms" track-by="$index" v-show="item != '' && item != true && item != false"><span class="text">{{item}}</span><span class="del" @click="deleteCondition(key,$event)"><img src="../assets/images/delete.png" alt=""></span></p>
                    <p class="del-all" @click="deleteAllCondition()" v-show="searchTerms.flag">清除</p>
                </div>
                <div class="scroll-header fixed-header scroll-row">
                    <ul class="scroll-col padding-row clearfix">
                            <li class="check check-all"  @click="checkAll($event)">
                                <a href="javascript:void (0)" class="check-box"></a>
                            </li>
                            <li class="change-value"
                                :class="{'sort':(order==-1)}"
                                @click="order = order * -1">价值排序
                                <img v-show="order==1" src="../assets/images/arrow.png">
                                <img v-show="order==-1" src="../assets/images/active-arrow-down.png">
                            </li>
                            <li class="width-more">姓名</li>
                            <li>常客等级</li>
                            <li class="width-middle">客票舱位</li>
                            <li>特殊服务</li>
                            <li>联程</li>
                            <li>同行</li>
                            <li class="long-short-10">值机登机状态</li>
                            <!--<li class="long-short-10">志愿者选择</li>-->
                            <li class="long-short">操作</li>
                            <li class="long">操作说明</li>
                        </ul>
                </div>
                <div class="scroll-max-height-wrap">
                    <ul class="scroll-row">

                        <li v-for="l in lists | orderBy 'passengerValue' order" track-by="$index" class="line-list">
                            <ul class="scroll-col padding-row clearfix volunteer-list">
                                <li class="check check-once set-line-height"  @click="checkOnce(l,$event)" data-id="{{l.passengerId}}" data-name="{{l.passengerName}}" data-contact="{{l.contact}}" data-passvalue="{{(order == 1) ? ($index + 1) :(lists.length - $index)}}">
                                    <a href="javascript:void (0)" class="check-box"></a>
                                </li>
                                <li v-show="order == 1" class="sequenceNumber set-line-height">{{$index + 1}}</li>
                                <li v-show="order == -1 && lists.length && lists.length > 0" class="sequenceNumber set-line-height">{{lists.length - $index}}</li>
                                <li class="width-more set-line-height"><a href="javascript:void (0)" class="name" @click="openUserMessage(l,$event)">{{l.passengerName}}</a></li>
                                <li>{{l.frequentPassengerClassEN}}</li>
                                <li class="width-middle set-line-height">{{l.ticketSeatClass}}</li>
                                <li class="set-line-height">{{l.specialService}}</li>
                                <li class="set-line-height" v-if="l.fellows && l.fellows.length > 0">是</li>
                                <li class="set-line-height" v-else>否</li>
                                <li v-if="l.fellows && l.fellows.length > 0" class="set-line-height">{{l.fellowCode}}</li>
                                <li v-else class="set-line-height">&nbsp;&nbsp;</li>
                                <li class="long-short-10 set-line-height">{{l.checkInBoardingStatus}}</li>
                                <!--<li class="long-short-10 toggle-html set-line-height" v-if="l.volunteer">已选择</li>
                                <li class="long-short-10 toggle-html set-line-height" v-else>未选择</li>-->
                                <li class="long-short clearfix set-line-height">
                                    <div class="col-xs-12">
                                        <button v-show="!l.volunteer"
                                                class="btn bg-deep-blue ok"
                                                @click="confirmSelectVolunteer(l,$event)">确 认</button>
                                        <button v-show="l.volunteer"
                                                class="btn bg-white border-deep-blue cancel"
                                                @click="cancelSelectVolunteer(l,$event)">取 消</button>
                                    </div>
                                </li>
                                <li class="long remarkText set-line-height">
                                    <button
                                        class="btn btn-callSlide border-orange bg-white"
                                        :class="{'mark-end':(l.comment != '')}"
                                        @click="toggleTextarea(l,$event)">说 明</button>
                                    <div class="call-slide-content" v-show="l.showRemarkTextFlag">
                                        <textarea rows="6" @keyup.enter="closeRemarkText(l)" v-model="l.comment"></textarea>
                                        <input type="submit" class="btn bg-deep-blue text-center" value="确定" @click="closeRemarkText(l)">
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="fixed-wrap padding-row hide-all" v-show="selectListFlag">
                <div class="fixed-content bg-white">
                    <div class="slide-header clearfix mu-row">
                        <a href="javascript:void (0)" class="pull-left hide-all" @click="closeSelectList">
                            <img src="../assets/images/fixed_arrow.png" alt="">
                        </a>
                        <p>批量操作名单</p>
                        <a href="javascript:void (0)" class="pull-right" @click="removeAllSelectList">
                            <img src="../assets/images/Icon.png" alt="">
                            清 空
                        </a>
                    </div>

                    <div class="scroll-max-height-wrap">
                        <ul class="scroll-row">
                            <li>
                                <ul class="scroll-col fixed-header">
                                    <li>价值</li>
                                    <li>姓名</li>
                                    <li>常客等级</li>
                                    <li>客票舱位</li>
                                    <li>特殊服务</li>
                                    <li>同行</li>
                                    <li>值机登机状态</li>
                                    <li>志愿者选择</li>
                                    <li>&nbsp;</li>
                                </ul>
                            </li>
                            <li class="line-list" v-for="l in selectVolunteerList | orderBy 'passengerValue'" track-by="$index">
                                <ul class="scroll-col clearfix">
                                    <li>{{$index + 1}}</li>
                                    <li><a href="javascript:void (0)" class="name">{{l.passengerName}}</a></li>
                                    <li>{{l.frequentPassengerClassEN}}</li>
                                    <li>{{l.ticketSeatClass}}</li>
                                    <li>{{l.specialService}}</li>
                                    <li>
                                        <span v-if="l.fellows">
                                            <a href="javascript:;" class="select-all">{{l.fellowCode}}</a>
                                            (
                                            <!--<a href="javascript:;" class="select-ca">(陈安、</a>-->
                                            <a href="javascript:;" class="select-zy" v-for="p in l.fellows">{{p.passengerName}} </a>
                                            )
                                        </span>
                                        <span v-else>&nbsp;&nbsp;&nbsp;</span>
                                    </li>
                                    <li>{{l.checkInBoardingStatus}}</li>
                                    <li v-if="l.volunteer">已选择</li>
                                    <li v-else>未选择</li>
                                    <li @click="deleteOne(l,$event)"><a href="javascript:void (0)"><img src="../assets/images/closelight2@.png" alt=""></a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!--Right Main End-->
        <!--Start Fixed Bottom-->
        <div class="text-right bottom-btn footer clearfix">
            <a href="javascript:void (0)" class="icon w-h-80 bg-deep-blue pull-left call-all" @click="showSelectList()">
                <img src="../assets/images/list_selected.png" alt="">
            </a>
            <div class="pull-left margin-left-20">
                已选择 :<span style="color: #4483ea" class="num">{{checkedNum || 0}}</span>
            </div>
            <div class="pull-right clearfix">
                <div class="pull-left height-80">
                    <button
                        class="btn  width-140 batch-choice bg-deep-blue"
                        v-show="checkedNum > 0"
                        @click="batchConfirmSelect($event)">批量确认</button>
                    <button
                        class="btn width-140 batch-choice bg-gray-disabled"
                        disabled
                        v-else
                        >批量确认</button>
                </div>
                <span class="bottom-border height-80 pull-left"></span>
                <div class="pull-left height-80">
                    <button
                        class="btn bg-white border-deep-blue width-140 hover-gray batch-cancelled"
                        @click="batchCancelSelect($event)"
                        v-show="checkedNum > 0">批量取消</button>
                    <button
                        class="btn width-140 hover-gray batch-cancelled bg-gray-disabled"
                        disabled
                        v-else>批量取消</button>
                </div>
            </div>
        </div>
        <!--Fixed Bottom End-->
    </div>
    <div id="user-message" v-show="userMessageFlag">
        <div class="user-wrap bg-white">
            <div class="section">
                <h4 class="user-title one">乘客信息</h4>
                <div class="message-group clearfix">
                    <div class="col-xs-3 header">姓名:</div>
                    <div class="col-xs-3 header">联系电话</div>
                    <div class="col-xs-3 header">旅客属性</div>
                    <div class="col-xs-3 header">备注</div>
                    <div class="col-xs-3">李志勇</div>
                    <div class="col-xs-3">18382828282</div>
                    <div class="col-xs-3">成人</div>
                    <div class="col-xs-3">xxxxxxxxx</div>
                    <div class="col-xs-3 header">证件类型</div>
                    <div class="col-xs-3 header">证件号</div>
                    <div class="col-xs-3 header">常旅客类型</div>
                    <div class="col-xs-3 header">常旅客号</div>
                    <div class="col-xs-3">身份证</div>
                    <div class="col-xs-3">100000000000</div>
                    <div class="col-xs-3">G</div>
                    <div class="col-xs-3">xxxxxxxxxxxx</div>
                </div>
                <hr>
            </div>
            <div class="section">
                <h4 class="user-title two">客票</h4>
                <div class="message-group clearfix">
                    <div class="col-xs-3 header">航线</div>
                    <div class="col-xs-3 header">状态</div>
                    <div class="col-xs-3 header">舱位</div>
                    <div class="col-xs-3 header">票号</div>
                    <div class="col-xs-3">PVG-TAO</div>
                    <div class="col-xs-3">Open</div>
                    <div class="col-xs-3">J</div>
                    <div class="col-xs-3">XXXXXXXXXXXXXXX</div>
                    <div class="col-xs-3">PVG-TAO</div>
                    <div class="col-xs-3">Open</div>
                    <div class="col-xs-3">J</div>
                    <div class="col-xs-3">XXXXXXXXXXXXXXX</div>
                </div>
                <hr>
            </div>
            <div class="section">
                <h4 class="user-title three">候补登记情况</h4>
                <div class="message-group clearfix">
                    <div class="col-xs-3 header">航线</div>
                    <div class="col-xs-3 header">舱位</div>
                    <div class="col-xs-3 header">补差价</div>
                    <div class="col-xs-3 header">备注</div>
                    <div class="col-xs-3">PVG-TAO</div>
                    <div class="col-xs-3">不限</div>
                    <div class="col-xs-3">是</div>
                    <div class="col-xs-3">XXXXXXXXX</div>
                </div>
            </div>
            <a href="javascript:;" class="close-btn2" @click="closeUserMessage">
                <img src="../assets/images/closelight2@.png" alt="">
            </a>
        </div>
    </div>
    <div id="association-passengers" v-show="showAssociaFlag">
        <div class="ap-wrap bg-white">
            <div class="ap-header">
                <h4>同行关联</h4>
                <a href="javascript:;" class="ap-close-btn hide-ap" @click="closeAssociaInfo">
                    <img src="../assets/images/closelight2@.png" alt="">
                </a>
            </div>
            <div class="ap-search clearfix">
                <div class="a-p-name">
                    <label for="ap-name">姓名 </label>
                    <input type="text" id="ap-name" v-model="searchName">
                </div>
                <div class="a-p-idCard">
                    <label for="ap-idCard">证件号 </label>
                    <input type="text" id="ap-idCard" v-model="searchId">
                </div>
                <div class="ap-search-btn pull-right">
                    <button class="btn bg-deep-blue" @click="searchNameId">搜 索</button>
                </div>
            </div>
            <div class="select-header">
                <ul class="select-title clearfix">
                    <li class="ap-check-box">&nbsp;</li>
                    <li>姓名</li>
                    <li>证件号</li>
                    <li>&nbsp;&nbsp;</li>
                </ul>
            </div>
            <ul class="ap-list">
                <li class="line-list" v-for="l in searchNameIdList" track-by="$index">
                    <ul class="clearfix" @click="checkAssPassenger(l,$event)">
                        <li class="ap-check-box check-once">
                            <a href="javascript:;" class="check-box"
                               :class="{'active':l.checkedFlag}"></a>
                        </li>
                        <li>{{l.passengerName}}</li>
                        <li>{{l.passengerId}}</li>
                        <li>&nbsp;</li>
                    </ul>
                </li>
            </ul>
            <div class="ap-select">
                <h3>已选同行关联</h3>
                <div class="select-header">
                    <ul class="select-title clearfix">
                        <li class="ap-check-box">&nbsp;</li>
                        <li>姓名</li>
                        <li>证件号</li>
                        <li>&nbsp;&nbsp;</li>
                    </ul>
                </div>
                <ul class="select-list">
                    <li v-for="l in checkedAssPassengerList" track-by="$index">
                        <ul class="clearfix">
                            <li class="ap-check-box" @click="deleteAssPassenger(l)"><a href="javascript:;"><img src="../assets/images/delete-error.png" alt=""></a></li>
                            <li>{{l.passengerName}}</li>
                            <li>{{l.passengerId}}</li>
                            <li>&nbsp;&nbsp;</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="ap-operation text-center">
                <button class="btn bg-deep-blue hide-ap" @click="closeAssociaInfo">确 定</button>
                <button class="btn border-deep-blue bg-white hide-ap" @click="closeAssociaInfo">取 消</button>
            </div>
        </div>
    </div>
    <loading></loading>
</template>

<script>
    import Vue from "vue";
    import menu from "./leftMenu.vue";
    import loading from "./loading.vue";
    import servers from "../servers.js";
    import popover from "../assets/commonjs/popover.js";

    export default {
        components: {
            menu,
            loading
        },
        data: function () {
            return {
                tabObj: {
                    workbench: true,
                    registration: false,
                    passenger: false
                },
                order: 1,
                queryDate: sessionStorage.getItem("select_date") || '',
                userMessageFlag: false,
                currentUserMessage: {},
                currentItem : JSON.parse(sessionStorage.getItem("current_item")) || "",
                lists: [],
                volunteerInfoObj: {},
                seats: [],
                grades: ['V','G','S'],
                volunteers: ['未选择','已选择'],
                searchTerms: {'flag':false,'seatChecked':'','gradeChecked':'','volunteerChecked':''},
                seatChecked: '舱位',
                gradeChecked:'常客等级',
                volunteerChecked: '志愿者选择状态',
                checkedNum: 0,
                batchSeatChecked: "U",
                selectListFlag: false,
                selectVolunteerList: [],
                showAssociaFlag: false,
                queryName: "",
                searchName:"",
                searchId:"",
                searchNameIdList:[],
                checkedAssPassengerList:[],
                shippingSpaceMatch:{
                    "Y":"YBMEHKLNRSVTGZQX",
                    "J":"JCDIO",
                    "W":"W",
                    "F":"FPA",
                    "U":"U"
                }
            }
        },
        route:{
            data:function(){
                var self = this;
                _.each(self.currentItem.remainSeats,(s) => {
                        self.seats.push(s.seatType);
                    });

                var params = {
                    "date": self.queryDate,
                    "flightNo": self.currentItem.flightNo,
                    "fromAirportCode":self.currentItem.fromAirportCode,
                    "toAirportCode":self.currentItem.toAirportCode
                }

                servers.queryFlightVolunteers(params,function(res){
                    console.log(res);
                    self.queryFlightVolunteersCallback(res);

                    self.lists.forEach(function(d){
                        d.passengerValue = +d.passengerValue;
                    });


                    sessionStorage.setItem('volunteer_lists',JSON.stringify(self.lists));
                })
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
        methods: {
            verifyTelNum:function(tel){
                var reg = /^1[1-9][0-9]\d{8}$/;
                tel = "" + tel;
                if(tel.indexOf(",") > -1){
                    tel = tel.split(",");
                    _.each(tel,(t) => {
                        if(t.length >= 11 && reg.test(t.substr(0,11))){
                            tel = t.substr(0,11);
                        }else{
                            tel = ""
                        }
                    })
                }else{
                    if(!reg.test(tel)){
                        tel = ""
                    }
                }
                return tel;
            },
            deleteAssPassenger: function(l){
                this.checkedAssPassengerList.$remove(l)
            },
            checkAssPassenger:function(l,e){
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                console.log(l.checkedFlag);
                l.checkedFlag = !l.checkedFlag;
                var has = false;
                if(l.checkedFlag){
                    _.each(self.checkedAssPassengerList,(c) => {
                        if(c.passengerId == l.passengerId){
                            has = true;
                        }
                    });
                    if(!has){
                        self.checkedAssPassengerList.push(l);
                    }
                }
            },
            searchNameId:function(){
                var self = this;
                if(self.searchName == "" && self.searchId == ""){
                    popover.toast({message:"请输入姓名或证件号"});
                    return;
                }
                var sessionVoluList = JSON.parse(sessionStorage.getItem('volunteer_lists'));
                console.log(sessionVoluList);

                sessionVoluList = _.filter(sessionVoluList,(l)=> {
                    if(self.searchName != "" && self.searchId != ""){
                        return (l.passengerName == self.searchName && l.passengerId == self.searchId);
                    }else{
                        return (l.passengerName == self.searchName || l.passengerId == self.searchId);
                    }
                })
                if(sessionVoluList.length == 0){
                    popover.toast({message:"未查询到此人信息"});
                }
                var searchNameIdObj = {
                    "passengerName":"",
                    "passengerId":"",
                    "checkedFlag":false
                }
                self.searchNameIdList = [];
                _.each(sessionVoluList,(l) => {
                    searchNameIdObj.passengerName = l.passengerName;
                    searchNameIdObj.passengerId = l.passengerId;
                    self.searchNameIdList.push(searchNameIdObj);
                })

                self.$log("searchNameIdList")
            },
            deleteQueryName: function(){
                this.queryName = "";
                this.lists = JSON.parse(sessionStorage.getItem('volunteer_lists'));
            },
            searchNameInfo: function(){
                var self = this;
                if(self.queryName == ""){
                    popover.toast({message:"请输入姓名"});
                    return;
                }
                self.lists = _.filter(self.lists,(l) => {
                        return l.passengerName == self.queryName;
                    });
                if(self.lists.length == 0){
                    popover.toast({message:"未查询到该人信息"})
                }
            },
            queryFlightVolunteersCallback: function(res) {
                let self = this;
                if(res.length == 0){
                    self.lists = [];
                    popover.toast({message:"查询志愿者列表为空"})
                    return;
                }
                res.forEach(function(r){
                    self.volunteerInfoObj = {
                        "passengerId":"",
                        "passengerValue":"",
                        "passengerName":"",
                        "frequentPassengerClassEN":"",
                        "ticketSeatClass":"",
                        "specialService":"",
                        "fellowCode":"",
                        "fellows":[],
                        "checkInBoardingStatus":"",
                        "volunteer":"",
                        "comment":"",
                        "showRemarkTextFlag": false
                    }
                    self.volunteerInfoObj.passengerId = r.identityNo;
                    self.volunteerInfoObj.passengerValue = r.valueWeight;
                    self.volunteerInfoObj.passengerName = r.name;
                    self.volunteerInfoObj.contact = r.contact;
                    self.volunteerInfoObj.frequentPassengerClassEN = ((r.frequentPassengerClassEN.indexOf("null") > -1) || (r.frequentPassengerClassEN == "/")?"":r.frequentPassengerClassEN);
                    self.volunteerInfoObj.ticketSeatClass = r.ticketSeatClass;
                    self.volunteerInfoObj.specialService = r.specialService;
                    self.volunteerInfoObj.checkInBoardingStatus = r.checkInBoardingStatus;
                    self.volunteerInfoObj.volunteer = r.volunteer;
                    self.volunteerInfoObj.comment = r.comment;
                    self.volunteerInfoObj.fellowCode = r.fellowCode;
                    if(r.fellows.length){
                        r.fellows.forEach((f) => {
                            var fellowsObj = {"sequence":"","passengerId":"","passengerName":""};
                            fellowsObj.sequence = f.sequence;
                            fellowsObj.passengerId = f.passengerId;
                            fellowsObj.passengerName = f.passengerName;
                            self.fellows.push(fellowsObj);
                        });
                    }


                    self.lists.push(self.volunteerInfoObj);
                    self.lists.forEach(function(d){
                        d.passengerValue = +d.passengerValue;
                    });
                });
            },

            /*changeUpGrade: function(a,event){
                $(event.currentTarget).parent().siblings("button").find("i").html(a);
            },*/
            confirmSelectVolunteer: function(l,event){
                if(this.currentItem && this.currentItem.flyStatus != "未起飞"){
                    popover.toast({message:"该航班不能操作"});
                    return;
                }
                var self = this;
                var $this = $(event.currentTarget);
                var passValue = $this.closest("li").siblings(".check").data("passvalue");
                var comment = $this.closest("li").siblings(".remarkText").find("textarea").val();
                var concact = self.verifyTelNum(l.contact);
                var params = [{
                    identityNo: l.passengerId,
                    name: l.passengerName,
                    passengerValue: passValue,
                    date: self.queryDate,
                    flightNo: self.currentItem.flightNo,
                    comment: comment,
                    contact: concact,
                    fromAirportCode:self.currentItem.fromAirportCode,
                    toAirportCode:self.currentItem.toAirportCode
                }];

                servers.chooseVolunteers(params,function(res){
                    console.log(res);
                    l.volunteer = true;
                    var listSession = JSON.parse(sessionStorage.getItem("volunteer_lists"));
                    _.each(listSession,(ls) => {
                        if(ls.passengerId == l.passengerId){
                            ls.comment = l.comment;
                            ls.volunteer = l.volunteer;
                        }
                    })
                    sessionStorage.setItem('volunteer_lists',JSON.stringify(listSession));
                });
                self.checkedNum = 0;
                $(".scroll-row").find(".check-box").each(function(index,el){
                    $(el).removeClass("active")
                });
                self.selectVolunteerList = [];
            },
            cancelSelectVolunteer: function(l,event){
                if(this.currentItem && this.currentItem.flyStatus != "未起飞"){
                    popover.toast({message:"该航班不能操作"});
                    return;
                }
                var self = this;
                var $this = $(event.currentTarget);
                var passValue = $this.closest("li").siblings(".check").data("passvalue");
                var concact = self.verifyTelNum(l.contact);
                var params = [{
                    identityNo: l.passengerId,
                    name: l.passengerName,
                    passengerValue: passValue,
                    date: self.queryDate,
                    flightNo: self.currentItem.flightNo,
                    contact: concact,
                    fromAirportCode:self.currentItem.fromAirportCode,
                    toAirportCode:self.currentItem.toAirportCode
                }];

                servers.cancelVolunteers(params,function(res){
                    console.log(res);
                    l.volunteer = false;
                    var listSession = JSON.parse(sessionStorage.getItem("volunteer_lists"));
                    _.each(listSession,(ls) => {
                        if(ls.passengerId == l.passengerId){
                            ls.comment = l.comment;
                            ls.volunteer = l.volunteer;
                        }

                    })
                    sessionStorage.setItem('volunteer_lists',JSON.stringify(listSession));
                });
                self.checkedNum = 0;
                $(".scroll-row").find(".check-box").each(function(index,el){
                    $(el).removeClass("active")
                });
                self.selectVolunteerList = [];
            },
            showSelectList: function(){
                this.selectListFlag = !this.selectListFlag;
                var self = this;
                if(this.selectListFlag){
                    $(".fixed-content").animate({bottom:80+"px"},400,function(){
                        $(".fixed-wrap .scroll-max-height-wrap").height($(window).height()/3*2-80);
                        $(".footer").css({
                            "width":$(".fixed-content").outerWidth(),
                            "left" :$(".fixed-content").offset().left
                        });
                    });
                }else{
                    $(".footer").css({
                        "width":$(".main-header").width(),
                        "left" :$(".main-header").offset().left
                    });
                }
            },
            closeSelectList: function(){
                this.selectListFlag = false;
                $(".fixed-content").animate({bottom:-1000},400,function(){
                    $(".footer").css({
                        "width":$(".main-header").width(),
                        "left" :$(".main-header").offset().left
                    });
                });

            },
            deleteOne: function(l,event){
                this.selectVolunteerList.$remove(l);
                this.checkedNum--;
                $(".check-box").each(function(i,el){
                    if($(el).data("id") == l.passengerId){
                        $(el).removeClass("active")
                    }
                });
                $(".check-box").eq(0).removeClass("active");
                console.log(this.selectVolunteerList);
            },
            removeAllSelectList: function(){
                this.selectVolunteerList = [];
                $(".check-box").each(function(i,el){
                    $(el).removeClass("active");
                });
                this.checkedNum = 0;
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
                    this.checkedNum = 0;
                    self.selectVolunteerList = [];
                }else{
                    $(".check-box").each(function(i,el){
                        $(el).addClass("active");
                    });
                    this.checkedNum = $(".scroll-row").find(".check-box.active").size()-1;
                    self.selectVolunteerList = JSON.parse(sessionStorage.getItem('volunteer_lists'));
                    self.$log('selectVolunteerList');
                }
            },
            checkOnce: function(l,e){
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                $(e.currentTarget).find('.check-box').toggleClass("active");
                $(".check-box").eq(0).removeClass("active");

                self.checkedNum = $(".scroll-row").find(".check-box.active").size();
                if($(e.currentTarget).find('.check-box').hasClass("active")){
                    var has = false;
                    self.selectVolunteerList.forEach(function(el){
                        if(el.passengerId == l.passengerId){
                            has = true;
                        }
                    });
                    if(!has){
                        self.selectVolunteerList.push(l)
                    }
                }else{
                    self.selectVolunteerList.forEach(function(el,i){
                        if(el.passengerId == l.passengerId){
                            self.selectVolunteerList.splice(i,1)
                        }
                    })
                }
            },
            openUserMessage: function(list,event){
                return;
                this.userMessageFlag = true;
                this.currentUserMessage = list;

            },
            closeUserMessage: function(){
                this.userMessageFlag = false
            },
            closeRemarkText: function(l){
                l.showRemarkTextFlag = false;
                var listSession = JSON.parse(sessionStorage.getItem("volunteer_lists"));
                _.each(listSession,(ls) => {
                    if(ls.passengerId == l.passengerId){
                        ls.comment = l.comment
                    }

                })
                sessionStorage.setItem('volunteer_lists',JSON.stringify(listSession));
            },
            toggleTextarea: function(list,e){
                var self = this;
                console.log(list.passengerId);
                _.each(self.lists,(l) => {
                    if(l.passengerId == list.passengerId){
                        list.showRemarkTextFlag = !list.showRemarkTextFlag;
                    }else{
                        l.showRemarkTextFlag = false;
                    }
                });
                var listSession = JSON.parse(sessionStorage.getItem("volunteer_lists"));
                _.each(listSession,(l) => {
                    if(l.passengerId == list.passengerId){
                        l.comment = list.comment
                    }

                })
                sessionStorage.setItem('volunteer_lists',JSON.stringify(listSession));
            },

            batchConfirmSelect: function(e){
                if(this.currentItem && this.currentItem.flyStatus != "未起飞"){
                    popover.toast({message:"该航班不能操作"});
                    return;
                }
                var self = this;
                var $this = $(e.currentTarget);
                var html = $this.html();
                var params = [];
                var i = 0;
                var wrap = $(".scroll-max-height-wrap");
                wrap.find(".check-once").each(function(index,el){
                    if($(el).find("a").hasClass("active")){
                        params[i] = {};
                        //params[i].name = $(this).siblings(".name").text();
                        params[i].name = $(this).data("name");
                        params[i].identityNo = $(this).data("id");
                        params[i].contact = $(this).data("contact");
                        params[i].passengerValue = $(this).data("passvalue");
                        params[i].comment = $(this).siblings(".remarkText").find("textarea").val();
                        params[i].date = self.queryDate;
                        params[i].flightNo = self.currentItem.flightNo;
                        params[i].fromAirportCode = self.currentItem.fromAirportCode;
                        params[i].toAirportCode = self.currentItem.toAirportCode;
                        i++;
                    }
                });

                servers.chooseVolunteers(params,function(res){
                    console.log(res);
                    self.lists.forEach(function(el){
                        res.forEach(function(r){
                            if(r.identityNo == el.passengerId){
                                el.volunteer = r.volunteer;
                                clearTimeout(timer);
                                $this.html("已选择");
                                var timer = setTimeout(function(){
                                    $this.html(html);
                                    clearTimeout(timer);
                                },1000);
                            }
                        });
                    });
                    sessionStorage.setItem('volunteer_lists',JSON.stringify(self.lists));
                });
                self.checkedNum = 0;
                $(".scroll-row").find(".check-box").each(function(index,el){
                    $(el).removeClass("active")
                });
                self.selectVolunteerList = [];
            },
            batchCancelSelect: function(e){
                if(this.currentItem && this.currentItem.flyStatus != "未起飞"){
                    popover.toast({message:"该航班不能操作"});
                    return;
                }
                var self = this;
                var $this = $(e.currentTarget);
                var html = $this.html();
                var params = [];
                var i = 0;
                var wrap = $(".scroll-max-height-wrap");
                wrap.find(".check-once").each(function(index,el){
                    if($(el).find("a").hasClass("active")){
                        params[i] = {};
                        params[i].name = $(this).data("name");
                        params[i].identityNo = $(this).data("id");
                        params[i].contact = self.verifyTelNum($(this).data("contact"));
                        params[i].passengerValue = $(this).data("passvalue");
                        params[i].date = self.queryDate;
                        params[i].flightNo = self.currentItem.flightNo;
                        params[i].fromAirportCode = self.currentItem.fromAirportCode;
                        params[i].toAirportCode = self.currentItem.toAirportCode;
                        i++;
                    }
                });

                servers.cancelVolunteers(params,function(res){
                    console.log(res);
                    self.lists.forEach(function(el){
                        res.forEach(function(r){
                            if(r.identityNo == el.passengerId){
                                el.volunteer = r.volunteer;
                                clearTimeout(timer);
                                $this.html("已取消");
                                var timer = setTimeout(function(){
                                    $this.html(html);
                                    clearTimeout(timer);
                                },1000);
                            }
                        });

                    });
                    sessionStorage.setItem('volunteer_lists',JSON.stringify(self.lists));
                });
                self.checkedNum = 0;
                $(".scroll-row").find(".check-box").each(function(index,el){
                    $(el).removeClass("active")
                });
                self.selectVolunteerList = [];
            },

            renderList: function(seatChecked,gradeChecked,volunteerChecked){
                console.log(seatChecked);
                console.log(gradeChecked);
                console.log(volunteerChecked);
                var arr = [];
                var self = this;
                var lists = JSON.parse(sessionStorage.getItem('volunteer_lists'));

                if(volunteerChecked == "未选择"){
                    lists.forEach(function(list){
                        if((seatChecked == ""?1:self.shippingSpaceMatch[seatChecked].indexOf(list.ticketSeatClass) > -1)
                                && list.frequentPassengerClassEN.indexOf(gradeChecked) > -1
                                && !list.volunteer
                        ){
                            arr.push(list);
                        }
                    })
                }else if(volunteerChecked == "已选择"){
                    lists.forEach(function(list){
                        if((seatChecked == ""?1:self.shippingSpaceMatch[seatChecked].indexOf(list.ticketSeatClass) > -1)
                                && list.frequentPassengerClassEN.indexOf(gradeChecked) > -1
                                && list.volunteer
                        ){
                            arr.push(list);
                        }
                    });
                }else{
                    if(seatChecked == "" && gradeChecked=="" && volunteerChecked == ""){
                        self.lists = lists;
                        return;
                    }
                    lists.forEach(function(list){
                        console.log(list.frequentPassengerClassEN.indexOf(gradeChecked) > -1);
                        if((seatChecked == "" ? 1 : self.shippingSpaceMatch[seatChecked].indexOf(list.ticketSeatClass) > -1)
                                && list.frequentPassengerClassEN.indexOf(gradeChecked) > -1
                        ){
                            arr.push(list);
                        }
                    });
                }
                this.lists = arr;
            },
            checkSeat: function(c,event){
                var self = this;
                this.searchTerms.flag = true;
                this.seatChecked = c;
                this.searchTerms.seatChecked = self.seatChecked;
                this.renderList(this.searchTerms.seatChecked,this.searchTerms.gradeChecked,this.searchTerms.volunteerChecked);
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
            },
            checkGrade: function(c,event){
                var self = this;
                this.searchTerms.flag = true;
                this.gradeChecked = c;
                this.searchTerms.gradeChecked = self.gradeChecked;
                this.renderList(this.searchTerms.seatChecked,this.searchTerms.gradeChecked,this.searchTerms.volunteerChecked);
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
            },
            checkVolunteerStatus: function(c,event){
                var self = this;
                this.searchTerms.flag = true;
                this.volunteerChecked = c;
                this.searchTerms.volunteerChecked = self.volunteerChecked;
                this.renderList(self.searchTerms.seatChecked,self.searchTerms.gradeChecked,self.searchTerms.volunteerChecked);
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
            },
            deleteCondition: function(i,event){
                this.searchTerms[i] = '';
                this.renderList(this.searchTerms.seatChecked,this.searchTerms.gradeChecked,this.searchTerms.volunteerChecked);
                if(this.searchTerms.seatChecked == '' && this.searchTerms.gradeChecked == '' && this.searchTerms.volunteerChecked == ''){
                    this.searchTerms.flag = false;
                    this.seatChecked = '舱位';
                    this.gradeChecked = '常客等级';
                    this.volunteerChecked = '志愿者选择状态';
                }
                if(this.searchTerms.gradeChecked == ''){
                    this.gradeChecked = '常客等级';
                }
                if(this.searchTerms.statusChecked == ''){
                    this.volunteerChecked = '志愿者选择状态';
                }
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
            },

            deleteAllCondition: function(){
                this.searchTerms.flag = false;
                this.searchTerms.seatChecked = '';
                this.searchTerms.gradeChecked = '';
                this.searchTerms.volunteerChecked = '';
                this.seatChecked = '舱位';
                this.gradeChecked = '常客等级';
                this.volunteerChecked = '志愿者选择状态';
                $(".check-box").eq(0).removeClass("active");
                this.renderList(this.searchTerms.seatChecked,this.searchTerms.gradeChecked,this.searchTerms.volunteerChecked);
            },
            showAssociaInfo: function(){
                if(this.currentItem && this.currentItem.flyStatus != "未起飞"){
                    popover.toast({message:"该航班不能操作"});
                    return;
                }
                this.showAssociaFlag = true;
                //remove old data
                this.searchName = "";
                this.searchId = "";
                this.searchNameIdList = [];
                this.checkedAssPassengerList = [];
            },
            closeAssociaInfo: function(){
                this.showAssociaFlag = false;
            }
        },
        ready: function(){
            var self = this;
            //Adaptive to window size
            var adaptiveWindow = function(){
                var
                    maxHeightWrap = $(".scroll-max-height-wrap"),
                    targetWidthEle = $(".main-header"),
                    bottomFixedEle = $(".bottom-btn");

                var windowHeight = $(window).height();
                bottomFixedEle.css({
                    "width":targetWidthEle.width(),
                    "left" :targetWidthEle.offset().left
                });

                var mh = windowHeight - maxHeightWrap.offset().top - bottomFixedEle.height();
                maxHeightWrap.height(mh);
            }

            $(window).resize(function() {
                if(self.$route.name == "volunteer"){
                    adaptiveWindow();
                }
            });
            adaptiveWindow();
        }
    }
</script>

<style scoped>
    .set-line-height {
        line-height: 25px !important;
        padding-top: 15px;
        padding-bottom: 10px;
    }

    .change-value {
        cursor: pointer;
    }
    .delete-btn {
        cursor: pointer;
        position: absolute;
        margin-left: -25px;
        margin-top: 14px;
    }

    .width-more {
        width: 10% !important;
    }
    .width-middle {
        width: 7% !important;
    }
    .fixed-header {
        font-weight: 700;
    }
    .check-box{
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url("../assets/images/checked.png") no-repeat right;
      vertical-align: middle;
    }
    .dropdown-menu>li {
        padding: 3px 20px;
    }
    .mu-row{
        padding-top:10px;
        padding-bottom:10px;
    }
    .main{
        padding:20px 20px 0 20px;
    }
    .main-header{
        padding:20px 0;
        position: relative;
        /*margin-bottom:20px;*/
    }
    .main-header h2{
        font-size: 30px;
        text-indent: 1em;
        color: #fff;
        border-right:1px solid #36353a;
        padding-right:20px;
    }
    .main-header .close-page{
        width: 22px;
        height: 22px;
        display: block;
        margin-right: 2em;
        margin-top:4px;
    }
    .main-header .close-page img{
        width: 100%;height: 100%;
    }

    .main-content-left{
        padding-right:10px;
    }
    .main-content-right{
        padding-left: 10px;
    }

    .passenger{
        padding:10px 0;
        color: #fff;
        text-align: center;
        margin-bottom:10px;
    }
    .passenger h3{
        font-size: 20px;
    }
    .passenger-list{
        background: #7d818a;
    }
    .passenger-special{
        background: #ddb770;
    }
    /*Left
    ********************************************/
    .select-passenger .dropdown{
        margin-right: 10px;
    }
    .select-end-create-icon{
        margin-bottom:10px;
        color: #fe5f4a;
    }
    .select-end-create-icon p{
        float: left;
        margin-right:10px;
        height: 20px;
        line-height: 20px;
        border-radius: 20px;
        padding: 0 5px;
    }
    .select-end-create-icon .text{
        padding-right: 30px;
        padding-left:10px;
    }
    .select-end-create-icon .icon{
        color: #fff;
    }
    .select-end-create-icon a{
        color: #fe5f4a;
    }
    .select-end-create-icon a img{
        margin-top:-1px;
    }
    .limit-scroll .scroll-col{
        padding-left: 20px;
        padding-right: 20px;
    }
    .scroll-row >li.active{
        /*border-left: 2px solid #4a9d93;*/
        /*background-color: #E8F4F4;*/
    }
    .dropdown ul li{
        float: none;
    }
    .scroll-row .line-two{
        border-left: 2px solid #4a9d93;
        background-color: #E8F4F4;
    }
    .scroll-col >li{
        width: 6%;
        text-align: center;
        line-height: 50px;
        min-height:1px;
        word-break:break-all;
        word-wrap : break-word;
    }
    .scroll-col .line-height-2{
        line-height: 25px;
    }
    .scroll-col .long{
        width: 15%;
        min-height: 1px;
        position: relative;
    }
    .scroll-row .long-short-10{
        width: 10.5%;
    }
    .scroll-row .long-short{
        width: 8%;
    }
    .long-short .col-xs-6{
        text-align: center;
        padding:0 3px;
    }

    .long-short .bg-white:hover,.hover-gray:hover{
        background: #eeeff4;
    }
    .scroll-col .cabin{
        width: 19.5%;
    }
    .scroll-col .name{
        color: #000;
    }
    /*Right
    ************************************************/
    .padding-row{
        padding-left: 20px;
        padding-right: 20px;
    }
    .select-card{
        border-width:1px;
        border-style: solid;
        position: relative;
        margin-bottom:20px;
    }
    .select-card:nth-child(1){
        margin-top: 10px;
    }
    .message{
        border-right-width:1px;
        border-right-style: solid;
    }
    .state{
        text-align: center;
    }
    .pass-select .bg-deep-blue{
        color: #fff;
    }
    .pass-select .bg-gray{
        color: #4483ea;
    }
    .state-title,.state-btn{
        position: absolute;
    }
    .state-title{
        top: 50px;
        width: 42px;
        left: 50%;
        margin-left: -21px;
    }
    .state-btn{
        bottom:50px;
        width: 110px;
        left: 50%;
        margin-left: -55px;
    }
    .close-btn {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 26px;
        border-radius: 100%;
        background: url("../assets/images/closedark.png") #fff no-repeat center center;
        position: absolute;
        left: -15px;
        top: -15px;
        border: 2px solid #4483ea;
    }
    .pass-select .close-btn{
        display: block;
    }


    .bottom-btn {
        box-shadow: 0 0 7px #e9eaec;
        line-height: 80px;
        background: #fff;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 999;
    }
    .w-h-80{
        width: 80px;
        height: 80px;
        text-align: center;
    }
    .bottom-btn .btn{
        color: #fff;
        margin:0 10px;
    }
    .select-passenger .width-140{
        width: 180px;
        text-align: left;
        border: none;
    }
    .width-140.bg-white{
        color: #A7A7A7;
        text-align: center;
        border:1px solid #A7A7A7;
    }
    .bottom-btn .width-140{
        text-align: center;
    }
    .bottom-btn >button{
        margin-right:1em;
    }
    .input-line-height{
        line-height:34px;
    }
    .form-control{
        display: inline-block;
        width: 90%;
        margin:-1px auto 0;
    }


    .margin-left-202{
        margin-left:20px;
        font-size: 18px;;
        position: absolute;
        left: 320px;
        bottom:18px;
    }
    .bottom-left-2{color: #5db0a6;}
    .bottom-left-2 small{color: #5db0a6;margin-left: 45px;font-size: 14px;}

    .scroll-col .btn{
        width: 60%;
        padding-left:0;
        padding-right:0;
    }
    .scroll-col .btn img{
        margin-right:10px;
    }
    .call-slide-content{
        width: 100%;
        padding:10px;
        box-shadow: 0 0 7px #eeeff4;
        position: absolute;
        z-index: 66;
        background: #fff;
        line-height: normal;
        top:100%;
    }
    .call-slide-content textarea{
        width: 100%;
        margin-bottom:10px;
        resize: none;
        border-color:#eeeff4;
    }
    .scroll-row .long-short button {
        width: 90% !important;
    }

    .border-orange{
        color: #BE841B;
        border:1px solid #DDB670;
        position: relative;
    }
    .long .border-orange,.call-slide-content .btn{
        width: 60%;
    }
    .in-footer .call-slide-content{
        top:auto;
        bottom:100%;
    }
    .mark-end{
        background-image: url("../assets/images/botton_triangle.png");
        background-position: top right;
        background-repeat: no-repeat;
    }


    .fixed-wrap{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        bottom: 0;
        background: rgba(0,0,0,.5);
        z-index: 999;
    }
    .fixed-content{
        width: 100%;
        position: absolute;
        left: 0;
        bottom:-1000px;
        padding-left: 20px;
        padding-right:20px;
    }
    .fixed-wrap .scroll-max-height-wrap{
        /*min-height:500px;*/
    }
    .slide-header{
        color: #4377cb;
        line-height: 40px;
    }
    .slide-header p{
        width: 200px;
        text-align: center;
        position: absolute;
        left: 50%;
        margin-left:-100px;
        font-size: 16px;
    }
    .fixed-wrap .scroll-col li{
        width: 11%;
    }
    .fixed-wrap .scroll-col .long{
        width: 28%;
        min-height:1px;
    }
    .fixed-wrap .bottom-btn{
        width: 100%;
    }


    .height-80{
        height: 80px;
        display: block;
    }
    .bottom-border{
        width: 1px;
        background: #eeeff4;
        margin:0 10px;
    }
    .margin-right-20{
        margin-right:20px;
    }
    .margin-left-20{
        margin-left:20px;
    }
    .dropup .btn{
        color: #000;
    }
    .border-deep-blue{
        color: #4483ea !important;
        border:1px solid #4483ea !important;
    }


    #user-message{
        width: 100%;height:100%;
        position: fixed;
        top:0;
        left: 0;
        background: rgba(0,0,0,.4);
        z-index: 999;
    }
    #user-message .col-xs-3{
        line-height: 30px;
    }
    .user-wrap{
        width: 700px;
        padding:30px 80px;
        height:580px;
        position: absolute;
        right:0;top:0;bottom:0;left:0;
        margin:auto;
        overflow:hidden;
    }
    .user-title{
        margin-top:30px;
        margin-bottom:20px;
        color: #4177cd;
        padding-left:30px;
        background-repeat: no-repeat;
        background-position: left center;
        font-size: 16px;
    }
    .one{
        background-image: url("../assets/images/infomation_.png");
    }
    .two{
        background-image: url("../assets/images/ticket.png");
    }
    .three{
        background-image: url("../assets/images/record2.png");
    }
    .header{
        color: #959da0;
    }
    #user-message .close-btn2{
        padding:5px;
        position: absolute;
        right:-1px;
        top:-1px;
    }

</style>


