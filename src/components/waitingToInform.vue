<template>
    <div class="container-fluid">
        <!--Start Left Menu-->
        <menu :tabobj='tabObj'></menu>
        <!--Left Menu End-->

        <!--Start Right Main-->
        <div class="main col-xs-11 bg-gray">
            <div class="main-header bg-black clearfix">
                <h2 class="pull-left">{{currentItem.flightNo}} 候补通知</h2>
                <div class="pull-left clearfix margin-left-202">
                    <div class="pull-left bottom-left-1">
                        <p>候补旅客 : {{currentItem.candidatesCount}}</p>
                    </div>
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
                <a v-link="{name:'workbench'}" class="pull-right close-page"><img src="../assets/images/closelight2@.png" alt=""></a>
            </div>
            <div class="main-content bg-white">
                <div class="select-passenger clearfix mu-row padding-row">
                    <div class="dropdown pull-left" v-if="alternateSpaceFlag ">
                        舱位 :
                        <style>
                            .dropdown .bg-white.border-gray{
                                text-align: left;
                            }
                        </style>
                        <button class="btn btn-default dropdown-toggle width-140 bg-white border-gray seatChecked" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" >
                            {{seatChecked}}
                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <li v-for="s in currentItem.remainSeats" track-by="$index" @click="checkSeat(s.seatType,$event)">{{s.seatType}}</li>
                        </ul>
                    </div>
                    <div class="dropdown pull-left">
                        筛选 :
                        <button class="btn btn-default dropdown-toggle width-140 bg-gray" type="button" id="dropdownMenu4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <span v-show="gradeChecked">{{gradeChecked}}</span>
                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu4">
                            <li v-for="g in grades" track-by="$index" @click="checkGrade(g,$event)">{{g}}</li>
                        </ul>
                    </div>
                    <div class="dropdown pull-left">
                        <button class="btn btn-default dropdown-toggle width-140 bg-gray" type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <span v-show="statusChecked">{{statusChecked}}</span>
                            <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu3">
                            <li v-for="n in notiStatus" track-by="$index" @click="checkStatus(n,$event)">{{n}}</li>
                        </ul>
                    </div>
                    <div class="search-wrap pull-right clearfix">
                        <input type="text" placeholder="姓名" class="pull-left passengerName" v-model="passengerName">
                        <img src="../assets/images/delete.png" class="delete-btn" v-show="passengerName" @click="deleteQueryName">
                        <button class="btn pull-left bg-deep-blue" @click="searchPassengers">搜 索</button>
                    </div>
                </div>
                <div class="select-end-create-icon mu-row padding-row clearfix">
                    <p class="icon bg-deep-blue" v-for="(key,item) in searchTerms" track-by="$index" v-show="item != '' && item != true && item != false"><span class="text">{{item}}</span><span class="del" @click="deleteCondition(key,$event)"><img src="../assets/images/delete.png" alt=""></span></p>
                    <p class="del-all" @click="deleteAllCondition()" v-show="searchTerms.flag">清除</p>
                </div>
                <div class="scroll-max-height-wrap">
                    <ul class="scroll-row">
                        <li class="scroll-header clearfix">
                            <ul class="scroll-col padding-row clearfix">
                                <li class="check check-all" @click="checkAll($event)">
                                    <a href="javascript:void (0)" class="check-box"></a>
                                </li>
                                <li @click="order = order * -1" class="sortList">价值排序
                                    <img src="../assets/images/arrow-down.png" v-show="!activeOrderFlag"/>
                                    <img src="../assets/images/active-arrow-up.png" v-show="activeOrderFlag">
                                </li>
                                <li >姓名</li>
                                <li>常客等级</li>
                                <li>候补时间</li>
                                <li>候补舱位</li>
                                <li>客票舱位</li>
                                <li class="long">候补备注</li>
                                <li>通知状态</li>
                                <li class="relative">
                                    操作说明
                                </li>
                            </ul>
                        </li>
                        <li class="line-list" v-for="list in lists | orderBy 'passengerValue' order" track-by="$index">
                            <ul class="scroll-col padding-row clearfix">
                                <li class="check check-once" @click="checkOnce($event)">
                                    <a href="javascript:void (0)" class="check-box"
                                       data-name="wxf" data-id={{list.identityNo}}
                                       data-contact={{list.contact}}>
                                    </a>
                                </li>
                                <li v-show="order == -1 ">{{$index + 1}}</li>
                                <li v-show="order == 1 && lists.length && lists.length > 0">{{lists.length - $index}}</li>
                                <li class="name" @click="openUserMessage(list,$event)"><a href="javascript:void (0)">{{list.passengerName}}</a></li>
                                <li>
                                    <span v-if="list.passengerLevel">{{list.passengerLevel}}</span>
                                    <span v-else>&nbsp;&nbsp;&nbsp;</span>
                                </li>
                                <li >
                                    <template v-for="requiredItem in list.alternateSeatClass" track-by="$index" v-if="list.alternateSeatClass">
                                        <span >{{requiredItem}}</span>
                                        <span v-if="list.alternateSeatClass.length-1>$index">|</span>
                                    </template>
                                    <span v-else>&nbsp;&nbsp;&nbsp;</span>
                                </li>
                                <li>
                                    <span v-if="list.ticketSeatClass">{{list.ticketSeatClass}}</span>
                                    <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </li>
                                <li>
                                    <span v-if="list.specialService">{{list.specialService}}</span>
                                    <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </li>
                                <li class="long">
                                    <span v-if="list.fellows.length>0">
                                        <a href="javascript:;" class="select-all">{{list.fellows.length}}</a>
                                        (
                                        <a href="javascript:;" class="select-zy" v-for="p in list.fellows">{{p.passengerName}} </a>
                                        )
                                    </span>
                                    <span v-else>&nbsp;&nbsp;&nbsp;</span>

                                </li>
                                <li class="success-html">
                                 {{list.notificationStatus}}
                                </li>
                                <li class="relative">
                                    <button class="btn btn-callSlide border-orange bg-white"
                                            v-bind:class="{'mark-end': list.comment.length>0}"
                                            @click="toggleTextarea(list,$event)">备注</button>
                                    <div class="call-slide-content" @click="remarkInfo($event)">
                                        <textarea rows="6" class="remarkInfo">{{list.comment}}</textarea>
                                        <!--<input type="submit" class="btn bg-deep-blue text-center" value="确定">-->
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--Right Main End-->
        <!--Start Fixed Bottom-->
        <div class="text-right bottom-btn clearfix" v-if="informSpaceFlag">
            <div class="pull-left">
                已选择 :<span class="num"> {{checkedNum || 0}} </span>
            </div>
            <div class="pull-right">

                <div class="dropup pull-left">
                    通知舱位 : {{searchTerms.seatChecked}}&nbsp;&nbsp;
                </div>
                <button class="btn bg-deep-blue width-140 batch-choice " @click="sendNotifi"><a href="javascript:;" class="inform">通 知</a><img src='../assets/images/concur.png' class='switchImg'/></button>
            </div>
        </div>
        <!--Fixed Bottom End-->
    </div>
    <div id="user-message" v-show="userMessageFlag">
        <div class="user-wrap bg-white">
            <div class="scroll-list">
                <div class="section">
                    <h4 class="user-title one">旅客信息</h4>
                    <div class="message-group clearfix">
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span id="name">姓名 :</span></div>
                            <div class="col-xs-7"><input type="text" class="form-control nameInfo" value="{{currentUserMessage.passengerName}}"></div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>证件号 :</span></div>
                            <div class="col-xs-7" class=""><input type="text" class="form-control credentials" value="{{currentUserMessage.identityNo}}"></div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>联系电话 :</span></div>
                            <div class="col-xs-7">
                                <input type="text" class="form-control contact"
                                                         value="{{currentUserMessage.contact}}"
                                                         @focus="getContactInfo($event)"
                                                         @blur="updateContactInfo($event)">
                            </div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>证件类型 :</span></div>
                            <div class="col-xs-7">
                                    <input type="text" class="form-control contact"
                                           value="{{currentUserMessage.identityType}}">
                            </div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>常客卡号 :</span></div>
                            <div class="col-xs-7"><input type="text" class="form-control" value="{{currentUserMessage.frequentPassengerCardNo}}"></div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>常客等级 :</span></div>
                            <div class="col-xs-7">
                                <input type="text" class="form-control" value="{{currentUserMessage.passengerLevel}}">
                            </div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>旅客属性 :</span></div>
                            <div class="col-xs-7">
                                <input type="text" class="form-control" value="{{currentUserMessage.ageGroup}}">
                            </div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>候补备注 :</span></div>
                            <div class="col-xs-7"><input type="text" class="form-control"></div>
                        </div>
                    </div>
                    <hr>
                </div>
                <div class="section">
                    <h4 class="user-title two">客票选择</h4>
                    <div class="message-group clearfix">
                        <div class="col-xs-3 header">航线</div>
                        <div class="col-xs-3 header">状态</div>
                        <div class="col-xs-3 header">舱位</div>
                        <div class="col-xs-3 header">票号</div>
                        <div class="col-xs-3">{{currentUserMessage.ticket.fromAirportCode}}-{{currentUserMessage.ticket.toAirportCode}}</div>
                        <div class="col-xs-3">{{currentUserMessage.ticket.ticketStatus}}</div>
                        <div class="col-xs-3">{{currentUserMessage.ticket.seatClass}}</div>

                        <div class="col-xs-3" style="margin-bottom:10px;" @click="ticketInfo"><a href="javascript:;" class="callBlack">{{currentUserMessage.ticket.ticketNo}}</a></div>
                    </div>
                    <hr>
                </div>
                <div class="section">
                    <h4 class="user-title three">候补登记情况</h4>
                    <div class="message-group clearfix">
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3 ">日期 : </div>
                            <div class="col-xs-7 fromDate">{{currentUserMessage.date}}</div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3">舱位 : </div>
                            <div class="col-xs-7">{{currentUserMessage.ticketSeatClass}}</div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3">出发机场 : </div>
                            <div class="col-xs-7 fromOrigin">{{currentUserMessage.fromAirportCode}}</div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3">到达机场 : </div>
                            <div class="col-xs-7 toOrigin">{{currentUserMessage.toAirportCode}}</div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3">航班指定 : </div>
                            <div class="col-xs-7">{{currentUserMessage.flightNo}}</div>
                        </div>
                    </div>
                </div>
                <a href="javascript:;" class="close-btn" @click="closeUserMessage">
                    <img src="../assets/images/closelight2@.png" alt="">
                </a>
            </div>
            <div class="text-center modify-show mu-row" v-show="modifyInfoFlag">
                <button class="btn bg-deep-blue width-140 save" @click="savePassengerInfo($event)">保 存</button>
                <button class="btn bg-white border-deep-blue width-140 cancel" @click="cancelPassengerInfo">取 消</button>
            </div>
        </div>
    </div>
    <div class="confirm" v-show="blackScreenDisplayFlag">
        <div class="confirm-box">
            <div class="pic">
                <img src="../assets/images/blackImg.png" alt="">
            </div>
            <div class="btn-group">
                <button class="btn bg-deep-blue true" @click="confirmDisplayInfo">选 择</button>
                <button class="btn bg-white border-deep-blue false cancel" @click="cancelDisplayInfo">取 消</button>
            </div>
        </div>
    </div>
</template>
<script>
    import menu from "./leftMenu.vue";
    import servers from "../servers.js";
    import popover from "../assets/commonjs/popover.js";
    import Vue from "vue";
    export default{
        data: function () {
            return {
                tabObj: {
                    workbench: true,
                    registration: false,
                    passenger: false
                },
                order:-1,
                userMessageFlag: false,
                currentUserMessage: {},
                currentItem : JSON.parse(sessionStorage.getItem("current_item")) || "",
                lists: [],
                informInfo:{
                    "passengerValue":"",
                    "passengerName":"",
                     identityNo:"",
                    "contact":"",
                    "passengerLevel":"",
                    "alternateSeatClass":"",
                    "ticketSeatClass":"",
                    "specialService":"",
                    "fellows":"",
                    "notificationStatus":"",
                    "comment":"",
                    "identityType":"",
                    "frequentPassengerCardNo": "",
                    "ageGroup": "",
                    "fellowComment": "",
                    "ticket": "",
                    "date": "",
                    "fromAirportCode": "",
                    "toAirportCode": "",
                    "flightNo": ""
                },
                seatChecked:'Y',
                grades: ['V','G','S'],
                notiStatus: ['已通知','未通知'],
                searchTerms: {'flag':false,'seatChecked':'','gradeChecked':'','statusChecked':''},
                gradeChecked: '常客等级',
                statusChecked:'通知状态',
                checkedNum: 0,
                alternateSpaceFlag:true,
                informSpaceFlag:true,
                passengerName:"",
                isErrTab:true,
                blackScreenDisplayFlag:false,
                activeOrderFlag:false,
                shippingSpaceMatch:{
                    "Y":"YBMEHKLNRSVTGZQX",
                    "J":"JCDIO",
                    "W":"W",
                    "F":"FPA",
                    "U":"U"
                }
//                certificateType:"身份证",
//                certificateTypeAll:["身份证","护照","军官证","台胞证","台湾通行证","港澳通行证","回乡证","其它"],
//                frequentRank :"G" ,
//                frequentRankAll:["V","G","E+","S","E","C"],
//                modifyInfoFlag:false

            }
        },
        components: {
            menu
        },
        route:{
            data: function () {
                var self = this;
                var params = {
                    "date": self.currentItem.date,
                    "flightNo": self.currentItem.flightNo,
                    "fromAirportCode": self.currentItem.fromAirportCode,
                    "toAirportCode": self.currentItem.toAirportCode
                };
                servers.alternateFlightList(params, function (res) {
                    console.log(res);
                    var passengerItems = res.json();
                    passengerItems.forEach(function (data) {
                        if (passengerItems[0].resultCode == 0) {
                            self.lists = [];
                            popover.toast({message: "返回错误数据"})
                            return;
                        }
                        self.informInfo.passengerValue = +data.valueWeight;
                        self.informInfo.passengerName = data.name;
                        self.informInfo.identityNo = data.identityNo;
                        self.informInfo.contact = data.contact;
                        self.informInfo.passengerLevel = data.frequentPassengerClassCN;
                        self.informInfo.alternateSeatClass = data.requiredSeatClass;
                        self.informInfo.ticketSeatClass = data.ticketSeatClass;
                        self.informInfo.specialService = data.specialService;
                        self.informInfo.fellows = data.fellows;
                        self.informInfo.identityType = data.identityType;
                        self.informInfo.frequentPassengerCardNo = data.frequentPassengerCardNo;
                        self.informInfo.ageGroup = data.ageGroup;
                        self.informInfo.fellowComment = data.fellowComment;
                        self.informInfo.ticket = data.ticket;
                        console.log(data.ticket);
                        self.informInfo.date = data.date;
                        self.informInfo.fromAirportCode = data.fromAirportCode;
                        self.informInfo.toAirportCode = data.toAirportCode;
                        self.informInfo.flightNo = data.flightNo;
                        //   self.informInfo.ageGroup = data.ageGroup;
                        if (data.noticed) {
                            self.informInfo.notificationStatus = "已通知";
                        } else {
                            self.informInfo.notificationStatus = "未通知";
                        }
                        self.informInfo.comment = data.comment;
                        self.lists.push(self.informInfo);

                        self.informInfo = {
                            "passengerValue": "",
                            "passengerName": "",
                            "identityNo": "",
                            "contact": "",
                            "passengerLevel": "",
                            "alternateSeatClass": "",
                            "ticketSeatClass": "",
                            "specialService": "",
                            "fellows": "",
                            "notificationStatus": "",
                            "comment": "",
                            "identityType": "",
                            "frequentPassengerCardNo": "",
                            "ageGroup": "",
                            "fellowComment": "",
                            "ticket": "",
                            "date": "",
                            "fromAirportCode": "",
                            "toAirportCode": "",
                            "flightNo": "",
                        }
                    }),
                        sessionStorage.setItem('watitingInform_lists', JSON.stringify(self.lists));
                    if (passengerItems.length == 0) {
                        self.lists = [];
                        popover.toast({message: "候补通知列表为空"})
                        return;
                    }
                    self.defaultSettingSpace();
                })

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
            defaultSettingSpace:function(){
                var self=this;
                var i=0;
                var params=[];
                var passengerNum=this.currentItem.candidatesCount;
                var remainSeats = this.currentItem.remainSeats;
              //  self.seatChecked =remainSeats[0].seatType||"";
                self.$nextTick(function(){
                    if(self.seatChecked!=''){
                        self.searchTerms.flag = true;
                        self.searchTerms.seatChecked = "Y";
                        var remainingNumbers=remainSeats[0].remainingNumber;
                        console.log(self.searchTerms.seatChecked);
                        self.rendList(self.searchTerms.seatChecked,self.searchTerms.gradeChecked,self.searchTerms.statusChecked);
                        if(self.list){
                            if(remainingNumbers>=passengerNum){
                                $(".check-box").addClass("active");
                                self.checkedNum = $(".check-box.active").size()-1;
                            }else{
                                $(".check-once .check-box").each(function(index,el){
                                    if(remainingNumbers>index){
                                        $(el).addClass("active");
                                    }
                                })
                                self.checkedNum = $(".check-box.active").size();
                            }
                        }

                    }else{
                        this.alternateSpaceFlag=false;
                        this.informSpaceFlag=false;

                    }
                })

            },
            checkAll: function(e){
                e.preventDefault();
                e.stopPropagation();
                var flag = $(e.currentTarget).find('.check-box').hasClass("active");
                if(flag){
                    $(".check-box").each(function(i,el){
                        $(el).removeClass("active");
                    });
                    this.checkedNum = 0;
                }else{
                    $(".check-box").each(function(i,el){
                        $(el).addClass("active");
                    });
                    this.checkedNum = $(".check-box.active").size()-1;
                }
            },
            checkOnce: function(e){
                var self=this;
                e.preventDefault();
                e.stopPropagation();
                $(e.currentTarget).find('.check-box').toggleClass("active");
                $(".check-box").eq(0).removeClass("active");
                self.$nextTick(function(){
                    var checkBoxAll=$('.check-box').length-1;
                    self.checkedNum = $(".check-box.active").size();
                    if(checkBoxAll==self.checkedNum){
                        $(".check-box").eq(0).addClass("active");
                    }
                })
            },
            openUserMessage: function(l,event){
                var self=this;
                this.userMessageFlag = true;
                this.currentUserMessage=l;
                console.log(l);

            },
            closeUserMessage: function(){
                this.userMessageFlag = false
            },
            toggleTextarea: function(list,e){
                var self=this;
                e.stopPropagation();
                e.preventDefault();
                var $this = $(event.currentTarget);
                $this.siblings(".call-slide-content").toggle();
                $this.parent().parent().parent().siblings().find(".call-slide-content").hide();
                $this.siblings(".call-slide-content").children(".remarkInfo").focus(function(){
                    $this.siblings(".call-slide-content").show();
                }).blur(function(){
                    $this.siblings(".call-slide-content").hide();
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
            rendList: function(seatChecked,gradeChecked,statusChecked){
                var self=this;
                var arr = [];
                var lists = JSON.parse(sessionStorage.getItem('watitingInform_lists'));
//                (seatChecked == ""?1:self.shippingSpaceMatch[seatChecked].indexOf(list.ticketSeatClass) > -1)
                lists.forEach(function(list){
                    if(list.alternateSeatClass.join().indexOf(seatChecked) > -1
                        && list.passengerLevel.indexOf(gradeChecked) > -1
                        && list.notificationStatus.indexOf(statusChecked) > -1){
                        arr.push(list);
                    }
                });
                self.lists = arr;

            },
            checkSeat: function(c,event){
                var self = this;
                this.searchTerms.flag = true;
                this.seatChecked = c;
                this.searchTerms.seatChecked = self.seatChecked;
                this.rendList(this.searchTerms.seatChecked,this.searchTerms.gradeChecked,this.searchTerms.statusChecked);
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
                this.rendList(this.searchTerms.seatChecked,this.searchTerms.gradeChecked,this.searchTerms.statusChecked);
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
            },
            checkStatus: function(c,event){
                var self = this;
                this.searchTerms.flag = true;
                this.statusChecked = c;
                this.searchTerms.statusChecked = self.statusChecked;
                this.rendList(self.searchTerms.seatChecked,self.searchTerms.gradeChecked,self.searchTerms.statusChecked);
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
            },
            deleteCondition: function(i,event){
                this.searchTerms[i] = '';
                console.log(this.searchTerms[i]);
                if(this.searchTerms.gradeChecked == ''){
                    this.gradeChecked = '常客等级';
                }
                if(this.searchTerms.statusChecked == ''){
                    this.statusChecked = '通知状态';
                }
                this.checkedNum = 0;
                $(".check-box").each(function(i,e){
                    $(e).removeClass("active");
                });
                if(this.searchTerms.seatChecked == '' && this.searchTerms.gradeChecked == '' && this.searchTerms.statusChecked == ''){
                    this.searchTerms.flag = false;
                    this.seatChecked = '';
                    this.gradeChecked = '常客等级';
                    this.statusChecked = '通知状态';
                }
                this.rendList(this.searchTerms.seatChecked,this.searchTerms.gradeChecked,this.searchTerms.statusChecked);
            },
            deleteAllCondition: function(){
                this.searchTerms.flag = false;
                this.searchTerms.seatChecked = '';
                this.searchTerms.gradeChecked = '';
                this.searchTerms.statusChecked = '';
                this.seatChecked = '';
                this.gradeChecked = '常客等级';
                this.statusChecked = '通知状态';
                $(".check-box").removeClass("active");
                this.checkedNum=0;
                this.rendList(this.searchTerms.seatChecked,this.searchTerms.gradeChecked,this.searchTerms.statusChecked);
            },
            sendCandidateNotification: function(params){
                var self=this;
                servers.sendCandidateNotification(params,function(res){
                    var response=res;
                    console.log(response);
                    self.lists.forEach(function(list){
                        response.forEach(function(r){
                            if(list.identityNo== r.identityNo){
                                if(r.noticed){
                                    list.notificationStatus="已通知";
                                }else{
                                    list.notificationStatus="未通知";
                                }
                            }
                        })
                    })
                    sessionStorage.setItem('watitingInform_lists',JSON.stringify(self.lists));
                   self.callback();
                })
            },
            callback:function(){
                var lists = JSON.parse(sessionStorage.getItem('watitingInform_lists'));
               var self=this;
                self.passengerName="";
                self.checkedNum=0;
                self.searchTerms.seatChecked = '';
                self.seatChecked = '';
                self.searchTerms.flag = false;
               $(".check-box").removeClass("active");
            },
            sendNotifi: function(){
                var self = this;
                this.searchTerms.seatChecked="F";
                if($(".scroll-max-height-wrap .check-box.active").size()>0 && this.searchTerms.seatChecked){
                    clearTimeout(timer);
                    var params = [];
                    var wrap = $(".scroll-max-height-wrap");
                    wrap.find(".check-once").each(function(index,el){
                        if($(el).find("a").hasClass("active")){
                            params[index] = {};
                            params[index].identityNo = $(el).find("a").attr("data-id");
                            params[index].contact = $(el).find("a").attr("data-contact");
                            params[index].name = $(el).siblings(".name").text();
                            params[index].date = self.currentItem.date;
                            params[index].flightNo = self.currentItem.flightNo;
                            params[index].fromAirportCode = self.currentItem.fromAirportCode;
                            params[index].seatClass = self.searchTerms.seatChecked;
                            params[index].comment = $(el).siblings(".relative").find("textarea").val();
                        }
                    });
                    $(" .batch-choice .inform").hide();
                    $(".batch-choice .switchImg").show();
                    var timer = setTimeout(function(){
                        $(" .batch-choice .inform").show();
                        $(".batch-choice .switchImg").hide();
                    },400);
                    self.sendCandidateNotification(params);
                }else{
                    popover.toast({message:"未选择旅客或者通知舱位"})
                    return;
                }

            },
            searchPassengers:function(){
                var self=this;
                self.checkedNum=0;
                self.searchTerms.seatChecked = '';
                self.seatChecked = '';
                self.searchTerms.flag = false;
                if(self.passengerName == ""){
                    popover.toast({message:"请输入姓名"});
                    return;
                }
                self.lists = _.filter(self.lists,(l) => {
                        return l.passengerName == self.passengerName;
            });
                if(self.lists.length == 0){
                    popover.toast({message:"未查询到该人信息"})
                }
            },
            deleteQueryName:function(){
                this.passengerName = "";
                var lists = JSON.parse(sessionStorage.getItem('watitingInform_lists'));
                this.lists=lists;
            },
            ticketInfo:function(){
                this.blackScreenDisplayFlag =true;
            },
            getContactInfo:function(el){
               var originalContact=$(el.currentTarget).val();
               sessionStorage.setItem("originalContact", originalContact);
            },
            updateContactInfo:function(el){
                this.modifyInfoFlag=true;
            },
            savePassengerInfo:function(el){
                var self=this;
                self.userMessageFlag=false;
                var originalContact= sessionStorage.getItem("originalContact");
                var current= $(el.currentTarget).parent(".modify-show").siblings(".scroll-list");
                var params=[];
                params[0]={};
                params[0].identityNo=current.find(".credentials").val();
                params[0].name=current.find(".nameInfo").val();
                params[0].originalContact=originalContact;
                params[0].newContact=current.find(".contact").val();
                params[0].date=current.find(".fromDate").text();
                params[0].fromAirportCode=current.find(".fromOrigin").text();
                params[0].toAirportCode=current.find(".toOrigin").text();
                console.log(params);
                servers.modifyWaitingInformation(params,function(res){
                    var response=res.json();
                    console.log(response);
//              console.log(response[0].resultCode)
//              if(response[0].resultCode==0){
//                  popover.toast({message:"返回错误数据"})
//                  return;
//              }
                })
            },
            cancelPassengerInfo:function(){
                this.userMessageFlag=false;
            },
            confirmDisplayInfo:function(){
                this.blackScreenDisplayFlag =false;
            },
            cancelDisplayInfo:function(){
                this.blackScreenDisplayFlag =false;
            }

        },
        watch:{
            'order': {
                handler: function (val, oldVal) {
                    if(val==-1){
                        this.activeOrderFlag=false;
                        $(".sortList").removeClass("sort")

                    }else{
                        this.activeOrderFlag=true;
                        $(".sortList").addClass("sort");
                    }
                },
                deep: true
            }
        },
        ready: function(){
            var
                $state = $(".state"),
                maxHeightWrap = $(".scroll-max-height-wrap"),
                targetWidthEle = $(".main-header"),
                bottomFixedEle = $(".bottom-btn");
            var windowHeight = $(window).height();
            $state.height($(".message").height());
            bottomFixedEle.css({
                "width":targetWidthEle.width(),
                "left" :targetWidthEle.offset().left
            });
            maxHeightWrap.each(function(i){
                maxHeightWrap.eq(i).height(windowHeight - maxHeightWrap.eq(i).offset().top - bottomFixedEle.height());
            });
        }
    }
</script>
<style scoped>
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
    .padding-row{
        padding-left:20px;
        padding-right:20px;
    }
    .main{
        padding:20px 20px 0 20px;
    }
    .main-header{
        padding:20px 0;
        color: #fff;
        position: relative;
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

    /*  Fixed Footer
    ************************************************/
    .bottom-btn {
        box-shadow: 0 0 7px #e9eaec;
        line-height: 80px;
        background: #fff;
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 777;
    }
    .bottom-btn .btn{
        color: #fff;
        margin-left: 10px;
    }
    .dropup{
        display: inline-block;
    }
    .select-passenger .dropdown{
        margin-right: 10px;
    }
    .select-end-create-icon{
        margin-bottom:10px;
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
    .select-end-create-icon{
        color: #fe5f4a;
    }
    .select-end-create-icon a img{
        margin-top:-1px;
    }
    /*select-reset*/
    .width-140{
        border: 0 none;
        text-align: left;
    }
    .width-140.bg-white{
        color: #A7A7A7;
        text-align: center;
        border:1px solid #A7A7A7;
    }
    .bottom-btn .width-140{
        text-align: center;
    }
    .bottom-btn >.pull-left{
        margin-left: 1em;
    }
    .bottom-btn >.pull-right{
        margin-right:1em;
    }
    .scroll-col li{
        width: 8.8%;
        text-align: center;
        line-height: 50px;
    }
    .scroll-col .check{
        width: 5%;
    }
    .scroll-col .long{
        width: 17.6%;
    }
    .scroll-col .more-line{
        line-height: 25px;
    }
    .scroll-col .relative{
        width: 15%;
    }

    .margin-left-202{
        font-size: 18px;;
        position: absolute;
        left: 310px;
        bottom:18px;
    }
    .bottom-left-1{color: #c6a66b;margin-right: 10px;}
    .bottom-left-2{color: #5db0a6;padding-left:10px;}
    .bottom-left-2 small{color: #5db0a6;margin-left: 45px;font-size: 14px;}
    .relative{
        position: relative;
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
        display: none;
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
    .bottom-btn span{
        margin-left: 10px;
        color: #4377cb;
    }
    .bottom-btn .pull-left{
        margin-left:30px;
    }
    .bottom-btn .dropup .btn{
        color: #000;
    }
    #user-message{
        width: 100%;height:100%;
        position: fixed;
        top:0;
        left: 0;
        background: rgba(0,0,0,.4);
        z-index: 999;
    }
    #user-message .col-xs-3,#user-message .col-xs-7{
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
    #user-message .close-btn{
        padding:5px;
        /*border:1px solid #eeeff4;*/
        position: absolute;
        right:-1px;
        top:-1px;
    }
    .batch-choice .inform{
        color:#fff!important;
    }
    .dropdown-menu>li:focus, .dropdown-menu>li:hover{
        background-color:#f5f5f5!important;
    }
    .batch-choice .switchImg{
        display:none;
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
        width: 73%;
        padding:33px 0;
        height:640px;
        position: absolute;
        right:0;top:0;bottom:0;left:0;
        margin:auto;
        overflow: hidden;
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
        /*background-image: url("images/infomation_.png");*/
    }
    .two{
        /*background-image: url("images/ticket.png");*/
    }
    .three{
        /*background-image: url("images/record2.png");*/
    }
    .header{
        color: #959da0;
    }
    #user-message .close-btn{
        padding:5px;
        border:1px solid #eeeff4;
        position: absolute;
        right:-1px;
        top:-1px;
    }
    .scroll-list {
        width: 100%;
        height: 538px;
        overflow: auto;
        padding: 0 80px;
    }
    #user-message .user-wrap >.text-center {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 5px;
        background: #fff;
        box-shadow: 0 0 5px #eeeff4;
    }
    .message-group .col-xs-6 {
        margin-bottom: 20px;
    }
    .col-xs-6 .col-xs-3 {
        color: #9fa2ab;
    }
    .col-xs-6 .dropdown .btn {
        width: 100%;
    }
    .confirm-box {
        width: 500px;
        height: 300px;
    }
    .confirm-box .pic img {
        width: 100%;
    }
    .confirm .bg-deep-blue {
        margin-right: 20px;
    }
    .save{
        text-align: center !important;
    }
    .cancel{
        border:1px solid #4483ea !important;
        color:#4377cb !important;
    }
</style>

