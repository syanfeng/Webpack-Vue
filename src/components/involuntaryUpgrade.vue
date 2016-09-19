<template>
    <div class="container-fluid">
        <!--Start Left Menu-->
        <menu :tabobj='tabObj'></menu>
        <!--Left Menu End-->
        <!--Start Right Main-->
        <div class="main col-xs-11 bg-gray">
            <div class="main-header bg-black clearfix">
                <h2 class="pull-left">{{currentItem.flightNo}} 非自愿升舱</h2>
                <div class="pull-left clearfix margin-left-202">
                    <div class="pull-left bottom-left-2">
                        <p>剩余座位 :{{leftSeats}}&nbsp;&nbsp;
                            <span
                                v-for="s in currentItem.remainSeats"
                                track-by="$index">
                                {{s.seatType}}:{{s.remainingNumber}}&nbsp;
                            </span>
                        </p>
                    </div>
                </div>
                <a v-link="{name:'workbench'}" class="pull-right close-page" ><img src="../assets/images/closelight2@.png" alt=""></a>
                <!--<div class="association-passengers pull-right">-->
                    <!--<div class="btn-group">-->
                        <!--<button class="btn  bg-light-blue"><img src="../assets/images/link.png" alt=""></button>-->
                        <!--<button class="btn  bg-deep-blue" @click="associateList">同行关联</button>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
            <div class="clearfix bg-white">
                <div class="select-passenger clearfix mu-row padding-row">
                    <div class="dropdown pull-left">
                        <button class="btn btn-default dropdown-toggle width-140 bg-gray  bg-disabled" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" >
                            {{seatChecked}}
                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <!--<li v-for="s in seats" track-by="$index" @click="checkSeat(s,$event)"><a href="javascript:void (0)">{{s}}</a></li>-->
                            <li v-for="s in currentItem.remainSeats" track-by="$index" @click="checkSeat(s.seatType,$event)"><a href=javascript:void(0)>{{s.seatType}}</a></li>
                        </ul>
                    </div>
                    <div class="dropdown pull-left">
                        <button class="btn btn-default dropdown-toggle width-140 bg-gray bg-disabled checkStatus" type="button" id="dropdownMenu4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" >
                            {{CheckINStatusChecked}}
                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu4">
                            <li v-for="c in checkInStatus" track-by="$index" @click="selectCheckInStatus(c,$event)"><a href="javascript:void (0)">{{c}}</a></li>
                        </ul>
                    </div>
                    <div class="dropdown pull-left">
                        <button class="btn btn-default dropdown-toggle width-140 bg-gray bg-disabled upStatus" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" >
                            {{upGradeStatusChecked}}
                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu3">
                            <li v-for="u in upGradeStatus" track-by="$index" @click="selectUpGradeStatus(u,$event)"><a href="javascript:void (0)">{{u}}</a></li>
                        </ul>
                    </div>
                    <div class="search-wrap pull-right clearfix">
                        <input type="text" placeholder="姓名" class="pull-left" v-model="searchName">
                        <img src="../assets/images/delete.png" class="delete-btn" v-show="searchName" @click="deleteQueryName">
                        <button class="btn pull-left bg-deep-blue searchName" @click="searchPassengers" >搜 索</button>
                    </div>
                </div>
                <div class="select-end-create-icon mu-row padding-row clearfix">
                    <p class="icon bg-deep-blue" v-for="(key,item) in searchTerms" track-by="$index" v-show="item != '' && item != true && item != false"><span class="text">{{item}}</span><span class="del" @click="deleteCondition(key,$event)"><img src="../assets/images/delete.png" alt=""></span></p>
                    <p class="del-all" @click="deleteAllCondition" v-show="searchTerms.flag">清除</p>
                </div>
                <div class="scroll-max-height-wrap">
                    <ul class="scroll-row">
                        <li class="scroll-header clearfix">
                            <ul class="scroll-col padding-row">
                                <li class="check check-all" @click="checkAll($event)">
                                    <a href="javascript:void (0)" class="check-box"></a>
                                </li>
                                <li class="sort valueList" @click="order = order * -1">价值排序
                                    <img src="../assets/images/active-arrow-down.png" v-show="activeOrderFlag">
                                    <img src="../assets/images/active-arrow-up.png" v-show="!activeOrderFlag">
                                </li>
                                <li>姓名</li>
                                <li>常客等级</li>
                                <li>客票舱位</li>
                                <!--<li>UP舱位</li>-->
                                <li>特殊服务</li>
                                <li>同行</li>
                                <li class="long-short-">值机登机状态</li>
                                <li class="long-short">操作</li>
                                <li class="long">操作说明</li>
                            </ul>
                        </li>
                        <li class="line-list" v-for="l in lists | orderBy 'passengerValue' order" track-by="$index">
                            <ul class="scroll-col padding-row clearfix">
                                <li class="check check-once" @click="checkOnce(l,$event)">
                                    <a href="javascript:void (0)" class="check-box checkBox" data-id="{{l.identityNo}}" data-contact="{{l.contact}}"></a>
                                </li>
                                <li v-show="order == 1">{{$index + 1}}</li>
                                <li v-show="order == -1 && lists.length && lists.length > 0">{{lists.length - $index}}</li>
                                <li class="name" @click="openUserMessage(l,$event)"><a href="javascript:void (0)" >{{l.passengerName}}</a></li>
                                <li>{{l.frequentPassengerClass}}</li>
                                <li>{{l.ticketSeatClass}}</li>
                                <!--<li class="toggle-html">{{l.newSeatClass}}</li>-->
                                <li>{{l.specialService}}</li>
                                <li>
                                    <span v-if="l.fellows.length>0">
                                        <a href="javascript:;" class="select-all">{{l.fellows.length}}{{l.fellows[0].sequence}}</a>
                                        <!--(
                                        &lt;!&ndash;<a href="javascript:;" class="select-ca">(陈安、</a>&ndash;&gt;
                                        <a href="javascript:;" class="select-zy" v-for="p in l.fellows">{{p.passengerName}} </a>
                                        )-->
                                    </span>
                                    <span v-else>&nbsp;&nbsp;&nbsp;</span>
                                </li>
                                <!--//  <li class="long-short-">{{l.checkInBoardingStatus}}</li>-->
                                <li class="long-short-">{{l.checkInBoardingStatus}}</li>
                                <li class="long-short clearfix">
                                    <div class="dropdown col-xs-6">
                                        <button class="btn btn-default dropdown-toggle bg-white" type="button" id="dropdownMenu5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <i>{{l.ticketSeatClass}}</i>
                                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu5">
                                            <li v-for="a in activeSeatClass" track-by="$index" @click="changeUpGrade(a,$event)"><a href="javascript:void (0)">{{a}}</a></li>

                                        </ul>
                                    </div>
                                    <div class="col-xs-6">
                                        <button  class="btn bg-deep-blue ok" @click="confirmUpGrade(l,$event)">确 认</button>
                                    </div>
                                </li>
                                <li class="long remarkText">
                                    <button class="btn btn-callSlide border-orange bg-white"
                                            v-bind:class="{'mark-end': l.comment.length>0}"
                                            @click="toggleTextarea(l,$event)">备 注</button>
                                    <div class="call-slide-content" @click="remarkInfo($event)" v-show="remarkInfoFlag">
                                        <textarea rows="6" class="remarkInfo">{{l.comment}}</textarea>
                                        <input type="submit" class="btn bg-deep-blue text-center" value="确定" @click="commentSubmit">
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
                        <a class="pull-left hide-all" @click="closeSelectList">
                            <img src="../assets/images/fixed_arrow.png" alt="">
                        </a>
                        <p>批量操作名单</p>
                        <a class="pull-right" @click="removeAllSelectList">
                            <img src="../assets/images/Icon.png" alt="">
                            清 空
                        </a>
                    </div>
                    <div class="scroll-max-height-wrap">
                        <ul class="scroll-row">
                            <li class="scroll-header">
                                <ul class="scroll-col clearfix">
                                    <li>价值</li>
                                    <li>姓名</li>
                                    <li>常客等级</li>
                                    <li>舱位</li>
                                    <!--<li>UP舱位</li>-->
                                    <li>特殊服务</li>
                                    <li>同行</li>
                                    <li>值机登机状态</li>
                                    <li>&nbsp;</li>
                                </ul>
                            </li>
                            <li class="line-list" v-for="l in selectUpGradeList | orderBy 'passengerValue'" track-by="$index">
                                <ul class="scroll-col clearfix">
                                    <li>{{$index+1}}</li>
                                    <li><a href="javascript:void (0)" class="name" >{{l.passengerName}}</a></li>
                                    <li>{{l.frequentPassengerClass}}</li>
                                    <li>{{l.ticketSeatClass}}</li>
                                    <!--<li class="toggle-html">{{l.newSeatClass}}</li>-->
                                    <li>{{l.specialService}}</li>
                                    <li>
                                        <span v-if="l.fellows.length>0">
                                            <a href="javascript:;" class="select-all">{{l.fellows.length}}</a>
                                            <!--(
                                            &lt;!&ndash;<a href="javascript:;" class="select-ca">(陈安、</a>&ndash;&gt;
                                            <a href="javascript:;" class="select-zy" v-for="p in l.fellows">{{p.passengerName}} </a>
                                            )-->
                                        </span>
                                        <span v-else>&nbsp;&nbsp;&nbsp;</span>
                                    </li>
                                    <li>{{l.checkInBoardingStatus}}</li>
                                    <li @click="deleteOne(l,$event)"><a href="javascript:void (0)" data-id="{{l.identityNo}}"}><img src="../assets/images/closelight2@.png" alt=""></a></li>
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
            <a href="javascript:;" class="icon w-h-80  pull-left call-all bg-gray-disabled" @click="showSelectList()">
                <img src="../assets/images/list_selected.png" alt="">
            </a>
            <div class="pull-left margin-left-20">
                已选择 :<span style="color: #4483ea" class="num"> {{checkedNum || 0}}</span>
            </div>
            <div class="query-wrap">
                <input type="text" placeholder="A2,(3、4、7、),2,3" class="form-control">
            </div>
            <div class="pull-right clearfix">

                <div class="dropup pull-left">
                    UP舱位:
                    <button class="btn btn-default dropdown-toggle bg-white width-140 bg-gray-disabled upSpace" disabled="disabled"  type="button" id="b1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                        {{batchSeatChecked}}
                        <span class="pull-right"><img src="../assets/images/slide-down.png" alt="" v-if="bgGrayDisabledFlag"></span>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="b1">
                        <li v-for="s in currentItem.remainSeats" track-by="$index" @click="checkSeat(s.seatType,$event)"><a href=javascript:void(0)>{{s.seatType}}</a></li>
                    </ul>
                </div>
                <div class="pull-left height-80">
                    <button class="btn  width-140 batch-choice bg-gray-disabled" disabled="disabled" @click="batchUpGrade($event)">批量升舱</button>
                </div>
                <!--<span class="bottom-border height-80 pull-left"></span>-->
                <!--<div class="pull-left height-80">-->
                    <!--<button class="btn border-deep-blue width-140 bg-white hover-gray batch-cancelled" @click="batchCancel($event)">批量取消</button>-->
                <!--</div>-->
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
                    <div class="col-xs-3">{{currentUserMessage.passengerName}}</div>
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
    <div id="association-passengers" class="" v-show="associationPassengersFlag">
        <div class="ap-wrap bg-white">
            <div class="ap-header">
                <h4>同行关联</h4>
                <a href="javascript:;" class="ap-close-btn hide-ap" @click="closePage">
                    <img src="../assets/images/closelight2@.png" alt="" >
                </a>
            </div>
            <div class="ap-search clearfix">
                <div class="a-p-name">
                    <label for="ap-name">姓名 </label>
                    <input type="text" id="ap-name" value="张三" v-model="associateName" placeholder="张三">
                </div>
                <div class="a-p-idCard">
                    <label for="ap-idCard">证件号 </label>
                    <input type="text" id="ap-idCard" v-model="associateId">
                </div>
                <div class="ap-search-btn pull-right">
                    <button class="btn bg-deep-blue" @click="associateSearch">搜 索</button>
                </div>
            </div>
            <ul class="ap-list">
                <li class="header">
                    <ul class="clearfix">
                        <li class="ap-check-box">&nbsp;</li>
                        <li>姓名</li>
                        <li>证件号</li>
                        <li>&nbsp;</li>
                    </ul>
                </li>
                <li class="line-list">
                    <ul class="clearfix">
                        <li class="ap-check-box"><a href="javascript:;" class="check-box"></a></li>
                        <li>张三</li>
                        <li>210666198808892828</li>
                        <li>&nbsp;</li>
                    </ul>
                </li>
                <li class="line-list">
                    <ul class="clearfix">
                        <li class="ap-check-box check-once"><a href="javascript:;" class="check-box active"></a></li>
                        <li>张三</li>
                        <li>210666198808892828</li>
                        <li>&nbsp;</li>
                    </ul>
                </li>
                <li class="line-list">
                    <ul class="clearfix">
                        <li class="ap-check-box check-once"><a href="javascript:;" class="check-box"></a></li>
                        <li>张三</li>
                        <li>210666198808892828</li>
                        <li>&nbsp;</li>
                    </ul>
                </li>
                <li class="line-list">
                    <ul class="clearfix">
                        <li class="ap-check-box check-once"><a href="javascript:;" class="check-box active"></a></li>
                        <li>张三</li>
                        <li>210666198808892828</li>
                        <li>&nbsp;</li>
                    </ul>
                </li>
            </ul>
            <div class="ap-select">
                <h3>已选同行关联</h3>
                <ul class="select-list">
                    <li class="select-header">
                        <ul class="clearfix">
                            <li class="ap-check-box">&nbsp;</li>
                            <li>姓名</li>
                            <li>证件号</li>
                            <li>同行</li>
                        </ul>
                    </li>
                    <li>
                        <ul class="clearfix">
                            <li class="ap-check-box"><a href="javascript:;"><img src="../assets/images/delete-error.png" alt=""></a></li>
                            <li>张三</li>
                            <li>210666198808892828</li>
                            <li>2A</li>
                        </ul>
                    </li>
                    <li>
                        <ul class="clearfix">
                            <li class="ap-check-box"><a href="javascript:;"><img src="../assets/images/delete-error.png" alt=""></a></li>
                            <li>王思聪</li>
                            <li>210666198808892828</li>
                            <li>2A</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="ap-operation text-center">
                <button class="btn bg-deep-blue hide-ap">确 定</button>
                <button class="btn border-deep-blue bg-white hide-ap">取 消</button>
            </div>
        </div>
    </div>
    <div class="confirm" v-show="confirmBoxFlag">
        <div class="confirm-box">
            <p class="confirm-text">确定执行操作 ?</p>
            <p class="error">操作后将不可恢复</p>
            <div class="btn-group">
                <button class="btn bg-deep-blue true" @click="confirmSubmit">确 认</button>
                <button class="btn btn-default false" @click="confirmCancel">取 消</button>
            </div>
        </div>
    </div>
</template>

<script>
    import menu from "./leftMenu.vue";
    import Vue from "vue";
    import servers from "../servers.js";
    import popover from "../assets/commonjs/popover.js";
    export default{
        data: function () {
            return {
                tabObj: {
                    workbench: true,
                    registration: false,
                    passenger: false
                },
                order:1,
                queryDate: sessionStorage.getItem("select_date") || '',
                userMessageFlag: false,
                remarkInfoFlag:false,
                confirmBoxFlag:false,
                activeOrderFlag:true,
                currentUserMessage: {},
                bgGrayDisabledFlag:false,
                currentItem : JSON.parse(sessionStorage.getItem("current_item")) || "",
                lists: [],
                activeSeatClass:['U','F','J','W','Y'],
                limitPassenger:{
                    identityNo:"",
                    "contact":"",
                    "passengerValue":"",
                    "passengerName":"",
                    "frequentPassengerClass":"",
                    "ticketSeatClass":"",
                    "newSeatClass":"",
                    "specialService":"",
                    "fellows":"",
                    "checkInBoardingStatus":"",
//                    "activeSeatClass":"",
                    "comment":""
                },
//                seats: ['U','F','J','W','Y'],
                checkInStatus: ['未值机','已值机未登机','已登机'],
                upGradeStatus: ['未升舱','已升舱'],
                searchTerms: {'flag':false,'seatChecked':'','CheckINStatusChecked':'','upGradeStatusChecked':''},
                seatChecked: '舱位',
                CheckINStatusChecked: '值机登机状态',
                upGradeStatusChecked:'升舱状态',
                checkedNum: 0,
                batchSeatChecked: "U",
                selectListFlag: false,
                selectUpGradeList: [],
                associationPassengersFlag:false,
                searchName:"",
                associateName:"",
                associateId:"",
                searchNameIdList:[],
                checkedAssPassengerList:[]
            }
        },
        components: {
            menu
        },
        route:{
            data:function(){
                var self = this;
               // var params = {'date':'2016-09-05','flightNo':'FM9309'};
               // "http://172.31.68.165:8080/guics/ChangeSeatClass/queryFlightPassengers?requestData=%7B%22date%22%3A%222016-09-05%22%2C%22flightNo%22%3A%22FM9309%22%7D"
               var params = {"date":self.currentItem.date,"flightNo":self.currentItem.flightNo,"fromAirportCode":self.currentItem.fromAirportCode,"toAirportCode":self.currentItem.toAirportCode};
                servers.upgradesInformationQuery(params,function(res){
                    var  limitpassengerItems= res.json();
                    console.log(res);
                    console.log(limitpassengerItems);
                    limitpassengerItems.forEach(function(data){
                        if(limitpassengerItems[0].resultCode==0){
                            self.lists=[];
                            popover.toast({message:"返回错误数据"})
                            return;
                        }
                        self.limitPassenger = {
                            "identityNo":"",
                            "contact":"",
                            "passengerValue":"",
                            "passengerName":"",
                            "frequentPassengerClass":"",
                            "ticketSeatClass":"",
                            "newSeatClass":"",
                            "specialService":"",
                            "fellows":"",
                            "checkInBoardingStatus":"",
//                            "activeSeatClass":"",
                            "comment":""
                        }
                        self.limitPassenger.identityNo = data.identityNo;
                        self.limitPassenger.contact = data.contact;
                        self.limitPassenger.passengerValue = data.valueWeight;
                        self.limitPassenger.passengerName = data.name;
                        self.limitPassenger.frequentPassengerClass = data.frequentPassengerClassCN;
                        self.limitPassenger.ticketSeatClass = data.ticketSeatClass;
                        self.limitPassenger.newSeatClass = data.newSeatClass;
                        self.limitPassenger.specialService = data.specialService;
                       self.limitPassenger.fellows = data.fellows;
                        self.limitPassenger.checkInBoardingStatus = data.checkInBoardingStatus;
                     //   self.limitPassenger.activeSeatClass = data.availableSeatClass;
                       self.limitPassenger.comment = data.comment;
                        self.lists.push(self.limitPassenger);
                    });
                    sessionStorage.setItem('limitPassenger_lists',JSON.stringify(self.lists));
                    if(limitpassengerItems.length == 0){
                        self.lists = [];
                        popover.toast({message:"升舱列表信息为空"})
                        return;
                    }
                })
                self.defaultSetting();
            }


        },
        computed: {
            leftSeats: function(){
                var remainSeats = this.currentItem.remainSeats;
                var num = 0;
                remainSeats.forEach(function(r){
                    num += r.remainingNumber
                });
                return num;
            }
        },
        methods: {
            defaultSetting:function(){
                var self=this;
                self.$nextTick(function(){
                    if(self.currentItem.flyStatus=='未起飞'){
                        $(".bg-disabled").prop("disabled",false);
                        console.log("111");
                        console.log();
                    }
                })

            },
            associateList:function(){
                var self=this;
                this.associationPassengersFlag=true;
                self.associateName="";
                self.associateId="";
            },
            associateSearch:function(){
                var self = this;
                if(self.associateName == "" && self.associateId == ""){
                    popover.toast({message:"请输入姓名或证件号"});
                    return;
                }

            },
            closePage:function(){
                this.associationPassengersFlag=false;
            },
            changeUpGrade: function(a,event){
                $(event.currentTarget).parent().siblings("button").find("i").text(a);
            },
            confirmSubmit:function(){
                var self=this;
                this.confirmBoxFlag=false;
                var params =JSON.parse(sessionStorage.getItem('upPassenger_list'));

                servers.confirmUpGrades(params,function(res){
                    console.log(res);
                    console.log(self.lists[0].identityNo);
                    self.lists.forEach(function(el){
                             if( el.identityNo==res[0].identityNo){
                                 el.newSeatClass = res[0].seatClass;
                             }
                    })
                   sessionStorage.setItem('limitPassenger_lists',JSON.stringify(self.lists));
                })

            },
            confirmCancel:function(){
                 this.confirmBoxFlag=false;
            },
            confirmUpGrade: function(l,event){
                var self = this;
                self.confirmBoxFlag=true;
             //   console.log(self.submitDataNum)
                $(".check-box").removeClass("active");
                var $this = $(event.currentTarget);
                var newSeatClass = $this.parent().siblings(".dropdown").find("button").find("i").text();
                var comment = $this.closest("li").siblings(".remarkText").find("textarea").text();
                var params = [{
                    identityNo: l.identityNo,
                    name: l.passengerName,
                    date: self.queryDate,
                    flightNo: self.currentItem.flightNo,
                    fromAirportCode: self.currentItem.fromAirportCode,
                    toAirportCode: self.currentItem.toAirportCode,
                    newSeatClass: newSeatClass,
                    comment: comment,
                    ticketSeatClass: l.ticketSeatClass,
                    contact: l.contact
                }];
                console.log(params);
                console.log("123");
               sessionStorage.setItem('upPassenger_list',JSON.stringify(params));
//                var paramsjson = JSON.stringify(params);
//                var options = {};
//                console.log(paramsjson);
//                options.params = {requestData:paramsjson};
//                servers.confirmUpGrades(options,function(res){
//                    console.log(res);
//                    l.newSeatClass = res[0].seatClass;
//                    l.ticketSeatClass = res[0].seatClass;
//                    sessionStorage.setItem('limitPassenger_lists',JSON.stringify(self.lists));
//                })
            },
            cancelUpGrade: function(l,event){
                var self = this;
//                var params = {
//                    identityNo: l.identityNo,
//                    passengerName: l.passengerName,
//                    date: self.queryDate,
//                    flightNo: self.currentItem.flightNo,
//                    comment:l.comment
//
//                };
                var params = {
                    identityNo:  l.identityNo,
                    name: l.passengerName,
                    date: "2016-08-26",
                    flightNo: "FM9219",
                    comment:"1jfkdlajg"
                };

                servers.cancelUpGrades(params,function(res){
                    l.newSeatClass = "未升舱";
                    l.ticketSeatClass = res[0].seatClass;
                    sessionStorage.setItem('limitPassenger_lists',JSON.stringify(self.lists));

                })
            },
            showSelectList: function(){
                var self = this;
                if(self.checkedNum>0){
                    this.selectListFlag = !this.selectListFlag;
                   // $(".call-all").removeClass("bg-gray-disabled").addClass("bg-deep-blue");
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
                }else{
                    this.selectListFlag =false;
//                    self.$nextTick(function(){
//                    $(".call-all").removeClass("bg-deep-blue").addClass("bg-gray-disabled");
//                    })

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
                var self=this;
                this.selectUpGradeList.$remove(l);
                this.checkedNum--;

                $(".checkBox").each(function(i,el){
                    if($(el).attr("data-id") == l.identityNo){
                        $(el).removeClass("active");
                    }
                });
                $(".check-box").eq(0).removeClass("active");
                console.log(this.selectUpGradeList);
            },
            removeAllSelectList: function(){
                this.selectUpGradeList = [];
                $(".check-box").each(function(i,el){
                    $(el).removeClass("active");
                });
                this.checkedNum = 0;
            },
            checkAll: function(e){
                var self=this;
                var flag = $(e.currentTarget).find('.check-box').hasClass("active");
                if(flag){
                    $(".scroll-max-height-wrap .checkBox").each(function(i,el){
                        $(el).removeClass("active");
                        $(e.currentTarget).find('.check-box').removeClass("active");
                    });
                    this.checkedNum = 0;
                    self.selectUpGradeList=[];
                }else{
                    $(".scroll-max-height-wrap .checkBox").each(function(i,el){
                        $(el).addClass("active");
                        $(e.currentTarget).find('.check-box').addClass("active");
                    });
                    this.checkedNum = $(".checkBox.active").size();
                    self.selectUpGradeList = JSON.parse(sessionStorage.getItem('limitPassenger_lists'));
                }
            },
            checkOnce: function(list,e){
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                $(e.currentTarget).find('.checkBox').toggleClass("active");
                $(".check-box").eq(0).removeClass("active");
                var checkBoxAll=$('.checkBox').length;
                self.checkedNum = $(".scroll-max-height-wrap  .checkBox.active").size();
                if($(e.currentTarget).find('.checkBox').hasClass("active")){
                    var has = false;
                    self.selectUpGradeList.forEach(function(el){
                        if(el.passengerValue == list.passengerValue){
                            has = true;
                        }
                    });
                    if(!has){
                        self.selectUpGradeList.push(list);
                    }
                }else{
                    self.selectUpGradeList.forEach(function(el,i){
                        if(el.passengerValue == list.passengerValue){
                            self.selectUpGradeList.splice(i,1)
                        }
                    })
                }
                if(checkBoxAll==self.checkedNum){
                    $(".check-box").eq(0).addClass("active");
                }
            },
            openUserMessage: function(list,event){
                this.userMessageFlag = true;
                this.currentUserMessage = list;

            },
            closeUserMessage: function(){
                this.userMessageFlag = false
            },
            toggleTextarea: function(list,e){
                var self=this;
                e.stopPropagation();
                e.preventDefault();
                var $this = $(event.currentTarget);
                self.remarkInfoFlag=true;
                self.$nextTick(function(){
                    $this.siblings(".call-slide-content").toggle();
                    $this.parent().parent().parent().siblings().find(".call-slide-content").hide();
                    $this.siblings(".call-slide-content").children(".remarkInfo").focus(function(){
                        $this.siblings(".call-slide-content").show();
                    }).blur(function(){
                        $this.siblings(".call-slide-content").hide();
                    })
                })
                document.onkeydown=function(event){
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    if(e && e.keyCode==13){
                        $this.siblings(".call-slide-content").hide();
                    }
                };
            },
            remarkInfo:function(e){
                e.stopPropagation();
                e.preventDefault();
            },
            batchCheckSeat: function(s,event){
                this.batchSeatChecked = s;
            },
            batchUpGrade: function(e){
                var self = this;
                var $this = $(e.currentTarget);
                var html = $this.html();
                var params = [];
                var i = 0;
                var wrap = $(".scroll-max-height-wrap");
                wrap.find(".check-once").each(function(index,el){
                    if($(el).find("a").hasClass("active")){
                        params[i] = {};
                        //  params[i].identityNo="123"
                        params[i].identityNo = $(el).find("a").attr("data-id");
                        params[i].contact = $(el).find("a").attr("data-contact");
                        params[i].name = $(el).siblings(".name").text();
                        params[i].date = self.queryDate;
                        params[i].flightNo = self.currentItem.flightNo;
                        params[i].newSeatClass = self.batchSeatChecked;
                        params[i].ticketSeatClass ="F";
                        params[i].fromAirportCode = self.currentItem.fromAirportCode;
                        params[i].toAirportCode = self.currentItem.toAirportCode;
                        params[i].comment = $(el).siblings(".remarkText").find(".remarkInfo").val();
                        i++;
                    }
                });

                servers.confirmUpGrades(params,function(res){
                    console.log(res);
                    self.lists.forEach(function(el){
                        res.forEach(function(r){
                            if(r.identityNo==el.identityNo){
                                el.newSeatClass = r.seatClass;
                                clearTimeout(timer);
                                $this.html("已升舱");
                                var timer = setTimeout(function(){
                                    $this.html(html);
                                    clearTimeout(timer);
                                },1000);
                            }
                        });

                    });
                    sessionStorage.setItem('limitPassenger_lists',JSON.stringify(self.lists));
                });
            },
            batchCancel: function(e){
                var self = this;
                var $this = $(e.currentTarget);
                var html = $this.html();
                var params = [];
                var i = 0;
                var wrap = $(".scroll-max-height-wrap");
                wrap.find(".check-once").each(function(index,el){
                    if($(el).find("a").hasClass("active")){
                        params[i] = {};
                        //   params[i].identityNo="123"
                        params[i].identityNo = $(el).find("a").attr("data-id");
                        params[i].name = $(el).siblings(".name").text();
                        params[i].date = self.queryDate;
                        params[i].flightNo = self.currentItem.flightNo;
                        params[i].comment = $(el).siblings(".remarkText").find(".remarkInfo").val();
                        i++;
                    }
                });
                console.log(params);
                var paramsjson = JSON.stringify(params);
                console.log(paramsjson);
                var options = {};
                options.params = {requestData:paramsjson};
                servers.cancelUpGrades(params,function(res){
                    self.lists.forEach(function(el){
                        res.forEach(function(r){
                            if(r.identityNo == el.identityNo){
                                el.newSeatClass = "未升舱";
                                clearTimeout(timer);
                                $this.html("已取消");
                                var timer = setTimeout(function(){
                                    $this.html(html);
                                    clearTimeout(timer);
                                },1000);
                            }
                        });

                    });
                    sessionStorage.setItem('limitPassenger_lists',JSON.stringify(self.lists));
                });
            },
            renderList: function(seatChecked,CheckINStatusChecked,upGradeStatusChecked){
                var arr = [];
                var lists = JSON.parse(sessionStorage.getItem('limitPassenger_lists'));
                if(upGradeStatusChecked=="未升舱"){
                    lists.forEach(function(list){
                        if(list.ticketSeatClass.indexOf(seatChecked) > -1
                            && list.checkInBoardingStatus.indexOf(CheckINStatusChecked) > -1
                            && list.newSeatClass.indexOf("未升舱") > -1
                        ){
                            arr.push(list);
                        }
                    });
                }else if(upGradeStatusChecked=="" || upGradeStatusChecked=="升舱状态"){
                    lists.forEach(function(list){
                        if(list.ticketSeatClass.indexOf(seatChecked) > -1
                            && list.checkInBoardingStatus.indexOf(CheckINStatusChecked) > -1
                        ){
                            arr.push(list);
                        }
                    });
                }else{
                    lists.forEach(function(list){
                        if(list.ticketSeatClass.indexOf(seatChecked) > -1
                            && list.checkInBoardingStatus.indexOf(CheckINStatusChecked) > -1
                            && list.newSeatClass.indexOf("未升舱") < 0
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
                this.renderList(this.searchTerms.seatChecked,this.searchTerms.CheckINStatusChecked,this.searchTerms.upGradeStatusChecked);
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
            },
            selectCheckInStatus: function(c,event){
                var self = this;
                this.searchTerms.flag = true;
                this.CheckINStatusChecked = c;
                this.searchTerms.CheckINStatusChecked = self.CheckINStatusChecked;
                this.renderList(this.searchTerms.seatChecked,this.searchTerms.CheckINStatusChecked,this.searchTerms.upGradeStatusChecked);
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
            },
            selectUpGradeStatus: function(c,event){
                var self = this;
                this.searchTerms.flag = true;
                this.upGradeStatusChecked = c;
                this.searchTerms.upGradeStatusChecked = self.upGradeStatusChecked;
                this.renderList(self.searchTerms.seatChecked,self.searchTerms.CheckINStatusChecked,self.searchTerms.upGradeStatusChecked);
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
            },
            deleteCondition: function(i,event){
                console.log("sanxhu")
                this.searchTerms[i] = '';
                console.log( this.searchTerms[i]);
                if(this.searchTerms.seatChecked == ''){
                    this.seatChecked = '舱位';
                }
                if(this.searchTerms.CheckINStatusChecked == ''){
                    this.CheckINStatusChecked = '值机登机状态';
                }
                if(this.searchTerms.upGradeStatusChecked == ''){
                    this.upGradeStatusChecked = '升舱状态';
                }
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
                if(this.searchTerms.seatChecked == '' && this.searchTerms.CheckINStatusChecked == '' && this.searchTerms.upGradeStatusChecked == ''){
                    this.searchTerms.flag = false;
                    this.seatChecked = '舱位';
                    this.CheckINStatusChecked = '值机登机状态';
                    this.upGradeStatusChecked = '升舱状态';
                }
                this.renderList(this.searchTerms.seatChecked,this.searchTerms.CheckINStatusChecked,this.searchTerms.upGradeStatusChecked);

            },
            deleteAllCondition: function(){
                var self=this;
                self.searchTerms.flag = false;
                self.searchTerms.seatChecked = '';
                self.searchTerms.CheckINStatusChecked = '';
                self.searchTerms.upGradeStatusChecked = '';
                self.seatChecked = '舱位';
                self.CheckINStatusChecked = '值机登机状态';
                self.upGradeStatusChecked = '升舱状态';
                $(".check-box").eq(0).removeClass("active");
                    self.renderList(self.searchTerms.seatChecked,self.searchTerms.CheckINStatusChecked,self.searchTerms.upGradeStatusChecked);
            },
            changeSeatClass: function(params,callback){
                var self = this;
                self.$http.post("static/json/changeSeatClass.json", params).then(function (response) {
                    if(response) {
                        var res = JSON.parse(response.data);
                        console.log(res.data);
                        callback(res.data);
                    }
                }, function (response) {
                    console.log('error')
                })
            },
            cancelSeatClassChange: function(params,callback){
                var self = this;
                self.$http.post("static/json/changeSeatClass.json", params).then(function (response) {
                    if(response) {
                        var res = JSON.parse(response.data);
                        console.log(res.data);
                        callback(res.data);
                    }
                }, function (response) {
                    console.log('error')
                })
            },
            searchPassengers:function(){
                var self=this;
                self.checkedNum=0;
                self.searchTerms.seatChecked = '';
                self.seatChecked = '';
                self.searchTerms.flag = false;
                if(self.searchName == ""){
                    popover.toast({message:"请输入姓名"});
                    return;
                }
                self.lists = _.filter(self.lists,(l) => {
                        return l.passengerName == self.searchName;
            });
                if(self.lists.length == 0){
                    popover.toast({message:"未查询到该人信息"})
                }
            },
       deleteQueryName:function(){
        this.searchName = "";
        var lists = JSON.parse(sessionStorage.getItem('limitPassenger_lists'));
        this.lists=lists;
       },
       commentSubmit:function(){
           this.remarkInfoFlag=false;
       }
        },
        watch: {
            'checkedNum': {
                handler: function (val, oldVal) {
                    if(val>0){
                        this.bgGrayDisabledFlag=true;
                        $('.upSpace').prop('disabled', false);
                        $(".upSpace").removeClass("bg-gray-disabled");
                        $('.batch-choice').prop('disabled', false);
                        $(".batch-choice").removeClass("bg-gray-disabled").addClass("bg-deep-blue");
                        $(".call-all").removeClass("bg-gray-disabled").addClass("bg-deep-blue");

                    }else{
                        this.bgGrayDisabledFlag=false;
                        $('.upSpace').prop('disabled', true);
                        $(".upSpace").addClass("bg-gray-disabled");
                        $('.batch-choice').prop('disabled', true);
                        $(".batch-choice").removeClass("bg-deep-blue").addClass("bg-gray-disabled");
                        $(".call-all").removeClass("bg-deep-blue").addClass("bg-gray-disabled");
                    }
                },
                deep: true
            },
            'order': {
                handler: function (val, oldVal) {
                    if(val==-1){
                     this.activeOrderFlag=false;
                    }else{
                    this.activeOrderFlag=true;
                    }
                },
                deep: true
            }

        },
        ready: function(){
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
    }
</script>

<style scoped>
    .query-wrap{
        float: left;
        line-height:80px;
        margin-left: 15px;
    }
    .query-wrap .form-control{
        display: inline-block;
    }
    .check-box{
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("../assets/images/checked.png") no-repeat right;
        vertical-align: middle;
    }
    .delete-btn {
        cursor: pointer;
        position: absolute;
        margin-left: -25px;
        margin-top: 14px;
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
        width: 8%;
        text-align: center;
        line-height: 50px;
        min-height:1px;
    }
    .scroll-col .line-height-2{
        line-height: 25px;
    }
    .scroll-col .long{
        width: 15%;
        position: relative;
    }
    .scroll-col .long-short-{
        width: 9%;
    }
    .scroll-row .long-short{
        width: 20%;
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
        display: none;
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


    .scroll-col .col-xs-6 .btn{
        width: 100%;
        padding-left:0;
        padding-right:0;
    }
    .scroll-col .col-xs-6 .btn img{
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
        display: none;
        top:100%;
    }
    .call-slide-content textarea{
        width: 100%;
        margin-bottom:10px;
        resize: none;
        border-color:#eeeff4;
    }
    .border-orange{
        color: #BE841B;
        border:1px solid #DDB670;
        position: relative;
    }
    .border-orange,.call-slide-content .btn{
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

    .long{
        min-height:1px;
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
        width: 36%;
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
    .long-short span.pull-left{
        margin-left:48%;
    }
   .name a{
       width:7% ;
       word-wrap:break-word !important ;
   }
    #user-message .close-btn2{
        padding:5px;
        border:1px solid #eeeff4;
        position: absolute;
        right:-1px;
        top:-1px;
    }
    .bg-disabled{
        background-color: #eeeff4 !important;
    }
</style>
