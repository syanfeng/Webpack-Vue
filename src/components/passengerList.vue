<template>
    <div class="container-fluid">
        <!--Start Left Menu-->
        <menu :tabobj="tabObj"></menu>
        <!--Left Menu End-->

        <!--Start Right Main-->
        <div class="main col-xs-11 bg-gray" id="cont">
            <div class="wrap bg-white">
                <div class="mu-row padding-row clearfix">
                    <div class="col-xs-11 form-inline clearfix">
                        <div class="col-xs-6">
                            <div class="form-group min-1280">
                                <label for="from">出发 (L) : </label>
                                <input type="text" class="form-control" id="from" placeholder="From"
                                       v-model="fromAirport"
                                       onkeyup="value=value.replace(/[^a-zA-Z,]/g,'')"
                                       onchange="value=value.replace(/[^a-zA-Z,]/g,'')">
                            </div>
                            <div class="form-group once-border1"></div>
                            <div class="form-group min-1280">
                                <label for="to">到达 (A) : </label>
                                <input type="text" class="form-control" id="to" placeholder="To"
                                       v-model="toAirport"
                                       onkeyup="value=value.replace(/[^a-zA-Z,]/g,'')"
                                       onchange="value=value.replace(/[^a-zA-Z,]/g,'')">
                            </div>
                        </div>
                        <div class="col-xs-6">
                            <div class="form-group u-name col-xs-6">
                                <label for="lineNum">航班号 : </label>
                                <input type="text" class="form-control shortcuts" id="lineNum" v-model="flightNum">
                            </div>
                            <div class="form-group u-name col-xs-6">
                                <label for="name">旅客姓名 : </label>
                                <input type="text" class="form-control" id="name" v-model="nameQuery">
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-1 text-right">
                        <button type="submit" class="btn bg-deep-blue hasMarginTop" @click="toSearch">搜索</button>
                    </div>
                </div>
                <div class="mu-row padding-row clearfix">
                    <div class="pull-left clearfix slide-down-btn">
                        <div class="dropdown pull-left">
                            <button class="btn btn-default dropdown-toggle text-left width-140 bg-gray border-none"
                                    type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="true">
                                {{waitingSpace}}
                                <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <li><a href="javascript:void (0)" v-for="list in altnatereLists"
                                       @click="altnatereSpace(list)" track-by="$index">{{list}}</a></li>
                            </ul>
                        </div>
                        <div class="dropdown pull-left">
                            <button class="btn btn-default dropdown-toggle text-left width-140 bg-gray border-none"
                                    type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="true">
                                {{informState}}
                                <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu3">
                                <li v-for="status in inStatus" @click="infoStatus(status)" track-by="$index"><a
                                    href="javascript:void (0)">{{status}}</a></li>
                            </ul>
                        </div>
                        <div class="dropdown pull-left">
                            <button class="btn btn-default dropdown-toggle text-left width-140 bg-gray border-none"
                                    type="button" id="dropdownMenux" data-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="true">
                                {{informNumber}}
                                <span class="pull-right"><img src="../assets/images/slide-down.png" alt=""></span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenux">
                                <li v-for="number in inNumber" @click="infoNumber(number)" track-by="$index"><a
                                    href="javascript:void (0)">{{number}}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="select-end-create-icon mu-row padding-row clearfix">
                    <p class="icon bg-deep-blue" v-for="(key,item) in searchTerms"
                       v-show="item != '' && item != true && item != false" @click="deleteSelect(key)"><span
                        class="text">{{item}}</span><a href="javascript:void(0)" class="del"><img
                        src="../assets/images/delete.png" alt=""></a></p>
                    <p class="del-all" @click="deleteAll()" v-show="searchTerms.flag"><a
                        href="javascript:void (0)">清除</a></p>
                </div>
                <hr/>

                <div class="mu-row padding-row clearfix state-btn">
                    <div class="pull-left">
                        已选择 : <input type="text" class="form-control">
                    </div>
                    <div class="pull-right clearfix">
                        <button class="btn pull-left clear-all" @click="removeLeavePassengers">已离港旅客一键清除(O)</button>
                        <div class="btn-group width-140 pull-left" @click="deletePassenger">
                            <button type="button" class="btn icon-btn bg-light-red">
                                <i class="glyphicon glyphicon-trash"></i>
                            </button>
                            <button type="button" class="btn text-btn bg-deep-red">旅客清除(E)</button>
                        </div>
                        <div class="btn-group width-140 pull-left person-watch" @click="personWatch">
                            <button type="button" class="btn icon-btn bg-light-yellow">
                                <i class="glyphicon glyphicon-user"></i>
                            </button>
                            <button type="button" class="btn text-btn bg-deep-yellow">旅客视图(V)</button>
                        </div>
                    </div>
                </div>

                <div class="scroll-max-height-wrap ">
                    <ul class="scroll-row checkList">
                        <li class="scroll-header">
                            <ul class="scroll-col padding-row clearfix ">
                                <li class="check checkAll" @click="checkAll($event)"><a href="javascript:void (0)"
                                                                                        class="check-box"></a></li>
                                <li @click="order = order * -1" class=" sortList">价值排序
                                    <img src="../assets/images/arrow-down.png" v-show="!activeOrderFlag"/>
                                    <img src="../assets/images/active-arrow-up.png" v-show="activeOrderFlag">
                                </li>
                                <li>姓名</li>
                                <li>常客等级</li>
                                <li class="lone">证件号</li>
                                <li>联系电话</li>
                                <li>出发机场</li>
                                <li>到达机场</li>
                                <li class="lone">候补航班</li>
                                <li>候补舱位</li>
                                <li @click="informNumAlert($event)">通知次数</li>
                            </ul>
                        </li>
                        <li class="line-list" v-for="list in lists | orderBy 'passengerValueOrder' order| filterBy passengerNameFilter in 'passengerName' | flightNoFilter | waitingSpaceFilter | informStateFilter | informNumberFilter" track-by="$index">
                            <ul class="scroll-col padding-row clearfix">
                                <li class="check check-once check-all" @click="checkOnce(list,$index,$event)"><a
                                    href="javascript:void (0)" class="check-box"></a></li>
                                <li v-show="order == -1 ">{{$index + 1}}</li>
                                <li v-show="order == 1 && lists.length && lists.length > 0">{{lists.length - $index}}</li>
                                <li class="name" @click="openUserMessage(list,$event)"><a href="javascript:void (0)">{{list.passengerName}}</a>
                                </li>
                                <li v-if="list.frequentPassengerClass">{{list.frequentPassengerClass}}</li>
                                <li v-else>&nbsp;&nbsp;</li>
                                <li class="lone">{{list.passengerId}}</li>
                                <li>{{list.passengerContact}}</li>
                                <li>{{list.fromAirportCode}}</li>
                                <li v-if="list.toAirportCode">{{list.toAirportCode}}</li>
                                <li v-else>&nbsp;&nbsp;</li>
                                <li class="lone line-two clearfix">
                                    <template v-for="candidateItem in list.candidateFlights  " track-by="$index">
                                        <div class="col-xs-4 " v-if="list.candidateFlights.length>6">
                                            <span class="col-xs-4 flightLine" v-if="$index==5"
                                                 @click="showDetailsFlights(list.candidateFlights)">
                                                ...
                                            </span>
                                            <span v-else v-show="$index<6">{{candidateItem.flightNo }}</span>
                                        </div>

                                        <div class="col-xs-4"
                                             v-if="list.candidateFlights.length>3 &&list.candidateFlights.length<=6">
                                            {{candidateItem.flightNo}}
                                        </div>
                                        <div class="col-xs-4 loneList" v-if="list.candidateFlights.length==3">
                                            {{candidateItem.flightNo}}
                                        </div>
                                        <div class=" loneList"
                                             v-if="list.candidateFlights.length>0 && list.candidateFlights.length<3">
                                            {{candidateItem.flightNo}}
                                        </div>
                                        <div class="" v-if="list.candidateFlights.length==0">
                                            &nbsp;&nbsp;&nbsp;
                                        </div>
                                    </template>



                                </li>
                                <li class="clearfix">
                                    <template v-for="requiredItem in list.requiredSeatClass" track-by="$index">
                                        <span v-if="requiredItem">{{requiredItem}}</span>
                                        <span v-else>&nbsp;&nbsp;&nbsp;</span>
                                        <span v-if="list.requiredSeatClass.length-1>$index">|</span>
                                    </template>
                                </li>
                                <li class="lone line-two clearfix">
                                    <template>
                                        <div class="col-xs-4">{{list.noticedFlights.length}}</div>
                                    </template>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!--Right Main End-->
    </div>
    <div class="fixed-wrap col-xs-11 bg-white " v-show="passengerViewFlag">
        <div class="wrap bg-white">
            <div class="mu-row">
                <div class="mu-row clearfix padding-row">
                    <a href="javascript:void (0)" class="close-btn pull-right" @click="closeView">
                        <img src="../assets/images/closelight2@.png" alt="">
                    </a>
                </div>
            </div>
            <div class="mu-row padding-row clearfix">
                <div class="pull-right">
                    <form class="form-inline">
                        <div class="form-group margin-right-20">
                            <label for="from2">旅客姓名 : </label>
                            <input type="text" class="form-control" id="from2" placeholder="姓名" v-model="username"/>
                            <img src="../assets/images/delete.png" class="delete-btn" v-show="username"
                                 @click="deleteQueryName">
                        </div>
                        <div class="form-group ">
                            <label for="from3">出发 : </label>
                            <input type="text" class="form-control" id="from3" placeholder="From"
                                   v-model="viewFromAirport"
                                   onkeyup="value=value.replace(/[^a-zA-Z,]/g,'')"
                                   onchange="value=value.replace(/[^a-zA-Z,]/g,'')">
                        </div>
                        <div class="form-group once-border"></div>
                        <div class="form-group">
                            <label for="to2">到达 : </label>
                            <input type="text" class="form-control" id="to2" placeholder="To"
                                   v-model="viewToAirport"
                                   onkeyup="value=value.replace(/[^a-zA-Z,]/g,'')"
                                   onchange="value=value.replace(/[^a-zA-Z,]/g,'')">
                        </div>
                        <button type="submit" class="btn btn-default" @click="searchPassenger($event)">搜索</button>
                    </form>
                </div>
            </div>
            <div class="scroll-max-height-wrap">
                <ul class="scroll-row">
                    <li class="scroll-header">
                        <ul class="scroll-col padding-row clearfix">
                            <li @click="order = order * -1" class="sortList">价值排序
                                <img src="../assets/images/arrow-down.png" v-show="!activeOrderFlag"/>
                                <img src="../assets/images/active-arrow-up.png" v-show="activeOrderFlag">
                            </li>
                            <li @click="openUserMessage($event)">乘客姓名</li>
                            <li>联系电话</li>
                            <li>出发机场</li>
                            <li>到达机场</li>
                            <li class="lone">候补航班</li>
                            <li>候补舱位</li>
                        </ul>
                    </li>
                    <li v-for="list in lists | orderBy 'passengerValueOrder' order" track-by="$index">
                        <ul class="scroll-col padding-row clearfix">
                            <li v-show="order == -1 ">{{$index + 1}}</li>
                            <li v-show="order == 1 && lists.length && lists.length > 0">{{lists.length - $index}}</li>
                            <li class="name"><a href="javascript:void (0)">{{list.passengerName}}</a></li>
                            <li v-if="list.passengerContact">{{list.passengerContact}}</li>
                            <li v-else>&nbsp;&nbsp;&nbsp;</li>
                            <li v-if="list.fromAirportCode">{{list.fromAirportCode}}</li>
                            <li v-else>&nbsp;&nbsp;&nbsp;</li>
                            <li v-if="list.toAirportCode">{{list.toAirportCode}}</li>
                            <li v-else>&nbsp;&nbsp;&nbsp;</li>
                            <li class="lone line-two clearfix">
                                <template v-for="candidateItem in list.candidateFlights |candidateFlightsFliter " track-by="$index">
                                    <!--<div class="col-xs-4 flightLine" v-if="list.candidateFlights.length>6">-->
                                        <!--&lt;!&ndash;{{candidateItem.flightNo }}&ndash;&gt;-->
                                    <!--</div>-->
                                    <!--<div class="col-xs-4 flightLine" v-if="list.candidateFlights.length>6">-->
                                       <!--......-->
                                    <!--</div>-->

                                    <div class="col-xs-4" v-if="list.candidateFlights.length>3 &&list.candidateFlights.length<=6" >
                                        {{candidateItem.flightNo}}
                                    </div>
                                    <div class="col-xs-4 loneList" v-if="list.candidateFlights.length==3">
                                        {{candidateItem.flightNo}}
                                    </div>
                                    <div class=" loneList" v-if="list.candidateFlights.length>0 && list.candidateFlights.length<3">
                                        {{candidateItem.flightNo}}
                                    </div>
                                    <div class="" v-if="list.candidateFlights.length==0">
                                        &nbsp;&nbsp;&nbsp;
                                    </div>

                                </template>
                                <div v-if="list.candidateFlights.length>6">......</div>
                            </li>
                            <li>
                                <template v-for="requiredItem in list.requiredSeatClass" track-by="$index">
                                    <span>{{requiredItem}}</span>
                                    <span v-if="list.requiredSeatClass.length-1>$index">|</span>
                                </template>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div id="user-message" v-show="userMessageFlag">
        <div class="user-wrap bg-white">
            <div class="scroll-list">
                <div class="section">
                    <h4 class="user-title one">旅客信息</h4>
                    <div class="message-group clearfix">
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>姓名 :</span></div>
                            <div class="col-xs-7"><input type="text" class="form-control nameInfo" value="张三"></div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>证件号 :</span></div>
                            <div class="col-xs-7" class=""><input type="text" class="form-control credentials"
                                                                  value="440507198204189203"></div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>联系电话 :</span></div>
                            <div class="col-xs-7"><input type="text" class="form-control contact" value="13501928374">
                            </div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>证件类型 :</span></div>
                            <div class="col-xs-7">
                                <div class="dropdown">
                                    <button
                                        class="btn btn-default dropdown-toggle bg-white card-defind clearfix shortcuts"
                                        type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="true">
                                        <span class="input-txt pull-left certificateType">{{certificateType}}</span>
                                        <span class="pull-right"><img src="../assets/images/slide-down.png"
                                                                      alt=""></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                        <li v-for="list in certificateTypeAll" @click="selectCertificateList(list)"><a
                                            href="javascript:;">{{list}}</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>常客卡号 :</span></div>
                            <div class="col-xs-7"><input type="text" class="form-control"></div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>常客等级 :</span></div>
                            <div class="col-xs-7">
                                <div class="dropdown">
                                    <button
                                        class="btn btn-default clearfix dropdown-toggle bg-white rank-defind shortcuts"
                                        type="button" id="dropdownMenu4" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="true">
                                        <span class="input-txt pull-left">{{frequentRank}}</span>
                                        <span class="pull-right"><img src="../assets/images/slide-down.png"
                                                                      alt=""></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu4">
                                        <li v-for="l in frequentRankAll" @click="frequentRankList(l)"><a
                                            href="javascript:;">{{l}}</a></li>
                                        <!--<li><a href="javascript:;">G</a></li>-->
                                        <!--<li><a href="javascript:;">E+</a></li>-->
                                        <!--<li><a href="javascript:;">S</a></li>-->
                                        <!--<li><a href="javascript:;">E</a></li>-->
                                        <!--<li><a href="javascript:;">C</a></li>-->
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3"><span>旅客属性 :</span></div>
                            <div class="col-xs-7">
                                <div class="dropdown">
                                    <button
                                        class="btn btn-default clearfix dropdown-toggle bg-white person-defind shortcuts"
                                        type="button" id="dropdownMenu3" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="true">
                                        <span class="input-txt pull-left">成人</span>
                                        <span class="pull-right"><img src="../assets/images/slide-down.png"
                                                                      alt=""></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenu3">
                                        <li><a href="#">成人</a></li>
                                        <li><a href="#">儿童</a></li>
                                        <li><a href="#">婴儿</a></li>
                                    </ul>
                                </div>
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
                        <div class="col-xs-3">SHA-PEK</div>
                        <div class="col-xs-3">Open</div>
                        <div class="col-xs-3">J</div>
                        <div class="col-xs-3" style="margin-bottom:10px;" @click="ticketInfo"><a href="javascript:;"
                                                                                                 class="callBlack">7812910362718</a>
                        </div>
                    </div>
                    <hr>
                </div>
                <div class="section">
                    <h4 class="user-title three">候补登记情况</h4>
                    <div class="message-group clearfix">
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3">日期 :</div>
                            <div class="col-xs-7">2016-09-07</div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3">舱位 :</div>
                            <div class="col-xs-7">F</div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3">出发机场 :</div>
                            <div class="col-xs-7 fromOrigin">SHA</div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3">到达机场 :</div>
                            <div class="col-xs-7 toOrigin">PEK</div>
                        </div>
                        <div class="col-xs-6 clearfix">
                            <div class="col-xs-3">航班指定 :</div>
                            <div class="col-xs-7">MU5157,MU5127</div>
                        </div>
                    </div>
                </div>
                <a href="javascript:;" class="close-btn" @click="closeUserMessage">
                    <img src="../assets/images/closelight2@.png" alt="">
                </a>
            </div>
            <div class="text-center modify-show mu-row">
                <button class="btn bg-deep-blue width-140 save" @click="savePassengerInfo($event)">保 存</button>
                <button class="btn bg-white border-deep-blue width-140 cancel" @click="cancelPassengerInfo">取 消</button>
            </div>
        </div>
    </div>
    <div id="number-alert" v-show="numberAlertFlag">
        <div class="search-box bg-white">
            <div class="js clearfix">
                <div class="col-xs-12 mu-row padding-row plane-search-title clearfix">
                    <span class="tit">已通知航班</span>
                    日期 : <span class="search-time">{{queryDate}}</span>
                    航线 : <span class="search-airline">SHA-PEK</span>
                </div>
            </div>
            <div class="mu-row person-list">
                <div class="scroll-center">
                    <ul class="scroll-row">
                        <li class="scroll-header padding-row">
                            <ul class="scroll-col clearfix">
                                <li class="col-xs-3">
                                    起飞时间
                                </li>
                                <li class="col-xs-3">
                                    航线
                                </li>
                                <li class="col-xs-3">
                                    航班
                                </li>
                                <li class="col-xs-3">
                                    航班状态
                                </li>
                            </ul>
                        </li>
                        <li class="padding-row list-short">
                            <ul class="scroll-col clearfix">
                                <li class="col-xs-3">
                                    12:00
                                </li>
                                <li class="col-xs-3">
                                    <p>SHA—PEK</p>
                                </li>
                                <li class="col-xs-3">
                                    <p>MU5117</p>
                                </li>
                                <li class="col-xs-3">
                                    正在值机
                                </li>
                            </ul>
                        </li>
                        <li class="padding-row list-short">
                            <ul class="scroll-col clearfix">
                                <li class="col-xs-3">
                                    12:00
                                </li>
                                <li class="col-xs-3">
                                    <p>SHA—PEK</p>
                                </li>
                                <li class="col-xs-3">
                                    <p>MU5117</p>
                                </li>
                                <li class="col-xs-3">
                                    正在值机
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <a href="javascript:void (0)" class="close-btn">
                <img src="../assets/images/closelight2@.png" alt="" @click="closeInformAlert">
            </a>
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
    import Vue from "vue";
    import servers from "../servers.js";
    import popover from "../assets/commonjs/popover.js";
    export default{
        data: function () {
            return {
                tabObj: {
                    workbench: false,
                    registration: false,
                    passenger: true
                },
                passengerNameFilter: '',    // 旅客姓名过滤 字段
                currentFlightNo: '',        // 航班号过滤 字段
                lists:[
                    {
                        "passengerName": "张三",
                        "passengerValueOrder":2,
                        "frequentPassengerClass": "F",
                        "passengerId": "123456789123456789",
                        "passengerContact":"12345678901",
                        "fromAirportCode": "SHA",
                        "toAirportCode":"PEK",
                        "candidateFlights": [
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH1234"
                            },
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH1111"
                            },
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH1234"
                            },
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH1111"
                            },
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH1734"
                            },
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH1111"
                            },
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH4451"
                            }
                        ],
                        "requiredSeatClass": ["U", "J", "Y"],
                        "noticedFlights": [
                            {
                                "id":1
                            },
                            {
                                "id":2
                            }
                        ]
                    },
                    {
                        "passengerName": "李四",
                        "passengerValueOrder":1000000,
                        "frequentPassengerClass": "F",
                        "passengerId": "123456789123456789",
                        "passengerContact":"12345678901",
                        "fromAirportCode": "SHA",
                        "toAirportCode":"PEK",
                        "candidateFlights": [
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH2222"
                            },
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH1111"
                            }
                        ],
                        "requiredSeatClass": ["F"],
                        "noticedFlights": [
                            {
                                "id":1
                            }
                        ]
                    },
                    {
                        "passengerName": "王五",
                        "passengerValueOrder":1000,
                        "frequentPassengerClass": "F",
                        "passengerId": "123456789123456789",
                        "passengerContact":"12345678901",
                        "fromAirportCode": "SHA",
                        "toAirportCode":"",
                        "candidateFlights": [
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH3333"
                            },
                            {
                                "date": "2016-09-14",
                                "flightNo": "MH4444"
                            }
                        ],
                        "requiredSeatClass": ["F"],
                        "noticedFlights": [
                            {
                                "id":1
                            }
                        ]
                    }
                ],
                order: -1,
                queryDate: sessionStorage.getItem("select_date") || '',
                userMessageFlag: false,
                currentUserMessage: {},
                passengerViewFlag: false,
                numberAlertFlag: false,
                altnatereLists: ['U', 'F', 'J', 'W', 'Y'],
                inStatus: ['已通知', '未通知'],
                inNumber: ['一次以上', '三次以上', '五次以上'],
                order: -1,
                searchTerms: {'flag': false, 'waitingSpace': '', 'informState': '', 'informNumber': ''},
                passenger: {
                    "passengerValueOrder": "",
                    "passengerName": "",
                    "frequentPassengerClass": "",
                    "passengerId": "",
                    "passengerContact": "",
                    "fromAirportCode": "",
                    "toAirportCode": "",
                    "candidateFlights": "",
                    "requiredSeatClass": "",
                    "noticedFlights": ""
                },
                waitingSpace: '候补舱位',
                waitingSpaceVal: '',        // 候补舱位筛选值
                informState: '通知状态',
                informStateVal: '',        // 通知状态筛选值
                informNumber: '通知次数',
                informNumberVal: '',   // 通知次数筛选值
                fromAirport: 'SHA',
                toAirport: '',
                username: '',
                viewFromAirport: 'SHA',
                viewToAirport: '',
                selectCheck: '',
                number: 0,
                checkedNum: 0,
                selectClearPassenger: [],
                flightNum: "",
                nameQuery: "",
                blackScreenDisplayFlag: false,
                activeOrderFlag:false
//                certificateType: "身份证",
//                certificateTypeAll: ["身份证", "护照", "军官证", "台胞证", "台湾通行证", "港澳通行证", "回乡证", "其它"],
//                frequentRank: "G",
//                frequentRankAll: ["V", "G", "E+", "S", "E", "C"]
            }
        },
        ready: function () {
            var maxHeightWrap = $(".scroll-max-height-wrap");
            var windowHeight = $(window).height();
            maxHeightWrap.height(windowHeight - maxHeightWrap.offset().top - 20);
        },
        components: {
            menu
        },
        filters: {
            /**
             * 航班号过滤器
             * @param arr
             * @returns {Array}
             */
            flightNoFilter: function (arr) {
                var self = this;
                var newArr = [];
                if(self.currentFlightNo == '') {
                    newArr = arr;
                } else {
                    arr.forEach((item) => {
                        for(let flight of item.candidateFlights) {
                            if(flight.flightNo == self.currentFlightNo) {
                                newArr.push(item);
                                break;
                            }
                        }
                    });
                }
                return newArr;
            },
            /**
             * 候补舱位过滤器
             * @param arr
             * @returns {Array}
             */
            waitingSpaceFilter: function (arr) {
                let self = this;
                let newArr = [];
                if(self.waitingSpaceVal == '') {
                    newArr = arr;
                } else {
                    let waitingSpacesStr = '';
                    switch (self.waitingSpaceVal) {
                        case 'Y':
                            waitingSpacesStr = "YBMEHKLNRSVTGZQX";
                            break;
                        case 'J':
                            waitingSpacesStr = "JCDIO";
                            break;
                        case 'W':
                            waitingSpacesStr = "W";
                            break;
                        case 'F':
                            waitingSpacesStr = "FPA";
                            break;
                        case 'U':
                            waitingSpacesStr = "U";
                            break;
                    }
                    arr.forEach((list) => {
                        for(let item of list.requiredSeatClass) {
                            if(waitingSpacesStr.indexOf(item) >= 0) {
                                newArr.push(list);
                                break;
                            }
                        }
                    });
                }
                return newArr;
            },
            /**
             * 通知状态过滤器
             * @param arr
             * @returns {Array}
             */
            informStateFilter: function (arr) {
                var self = this;
                var newArr = [];
                if(self.informStateVal == '') {
                    newArr = arr;
                } else {
                    if(self.informStateVal=="已通知"){
                        arr.forEach((item) => {
                            if(item.noticedFlights.length>0){
                            console.log(item.noticedFlights.length);
                            newArr.push(item);
                        }
                    });
                    }else{
                        arr.forEach((item) => {
                            if(item.noticedFlights.length==0){
                            console.log(item.noticedFlights.length);
                            newArr.push(item);
                        }
                    });
                    }
                }
                return newArr;
            },
            /**
             * 通知次数过滤器
             * @param arr
             * @returns {Array}
             */
            informNumberFilter: function (arr) {
                var self = this;
                var newArr = [];
                if(self.informNumberVal == '') {
                    newArr = arr;
                } else {
                    arr.forEach((item) => {
                        console.log(self.informNumberVal);
                        if(self.informNumberVal=="五次以上"){
                          if(item.noticedFlights.length>=5){
                              newArr.push(item);

                          }
                    }
                    if(self.informNumberVal=="三次以上"){
                        if(item.noticedFlights.length>=3){
                            newArr.push(item);

                        }
                    }
                    if(self.informNumberVal=="一次以上"){
                        if(item.noticedFlights.length>=1){
                            newArr.push(item);

                        }
                    }

                });

                }
                return newArr;
            },
            /**
             * 候补航班过滤
             * @param arr
             * @returns {Array}
             */
        candidateFlightsFliter: function (arr) {
         var self = this;
         var newArr = [];
         console.log(arr.length);
         if(arr.length>6){
             arr.forEach((item,index) => {
                if(index>=5){
                    return false;
                }
             newArr.push(item)
         });
         }else{
         newArr =arr
         }
         return newArr;

    }

        },
        methods: {
            passengerList: function (res) {
                var self = this;
                var passengerItems = res.json();
                self.lists = [];
                passengerItems.forEach(function (data) {
                    console.log(data);
//                 if(passengerItems[0].resultCode==0){
//                     self.lists=[];
//                     popover.toast({message:"返回错误数据"})
//                     return;
//                 }
                    self.passenger.passengerValueOrder = parseInt(data.valueWeight);
                    self.passenger.passengerName = data.name;
                    self.passenger.frequentPassengerClass = data.frequentPassengerClassCN;
                    self.passenger.passengerId = data.identityNo;
                    self.passenger.passengerContact = data.contact;
                    self.passenger.fromAirportCode = data.fromAirportCode;
                    self.passenger.toAirportCode = data.toAirportCode;
                    self.passenger.candidateFlights = data.requiredFlights;
                    self.passenger.requiredSeatClass = data.requiredSeatClass;
                    self.passenger.noticedFlights = data.noticedFlights;
                    self.lists.push(self.passenger);
                    self.passenger = {
                        "passengerValueOrder": "",
                        "passengerName": "",
                        "frequentPassengerClass": "",
                        "passengerId": "",
                        "passengerContact": "",
                        "fromAirportCode": "",
                        "toAirportCode": "",
                        "candidateFlights": "",
                        "requiredSeatClass": "",
                        "noticedFlights": ""
                    }
                });
                sessionStorage.setItem('passenger_lists', JSON.stringify(self.lists));
                if (passengerItems.length == 0) {
                    self.lists = [];
                    popover.toast({message: "候补名单列表为空"})
                    return;
                }
            },
            toSearch: function () {
                var self = this;
                self.fromAirport = self.fromAirport.toUpperCase();
                self.toAirport = self.toAirport.toUpperCase();
                self.flightNum = self.flightNum.toUpperCase();
                var params = {
                    "date": self.queryDate,
                    "fromAirportCode": self.fromAirport,
                    "toAirportCode": self.toAirport
                };
                if (self.fromAirport != "" && self.toAirport != '') {
                    self.passengerNameFilter = self.nameQuery;
                    self.currentFlightNo = self.flightNum;
                    servers.waitingPassengerList(params, function (res) {
                        self.passengerList(res);
                    });
                } else {
                    popover.toast({message: "出发机场或到达机场不能为空"});
                    return;
                }
            },
            checkAll: function (e) {
                var self = this;
                var flag = $(e.currentTarget).find('.check-box').hasClass("active");
                if (flag) {
                    $(".check-box").each(function (i, el) {
                        $(el).removeClass("active");
                    });
                    this.checkedNum = 0;
                    self.selectClearPassenger = [];
                } else {
                    $(".check-box").each(function (i, el) {
                        $(el).addClass("active");
                    });
                    this.checkedNum = $(".check-box.active").size() - 1;
                    self.selectClearPassenger = JSON.parse(sessionStorage.getItem('passenger_lists'));
                }
            },
            checkOnce: function (list, index, e) {
                e.preventDefault();
                e.stopPropagation();
                var self = this;
                $(e.currentTarget).find('.check-box').toggleClass("active");
                $(".check-box").eq(0).removeClass("active");
                var checkBoxAll = $('.check-box').length - 1;
                self.checkedNum = $(".check-box.active").size();
                if ($(e.currentTarget).find('.check-box').hasClass("active")) {
                    var has = false;
                    self.selectClearPassenger.forEach(function (el) {
                        if (el.passengerId == list.passengerId) {
                            has = true;
                        }
                    });
                    if (!has) {
                        self.selectClearPassenger.push(list);
                    }
                } else {
                    self.selectClearPassenger.forEach(function (el, i) {
                        if (el.passengerValueOrder == list.passengerValueOrder) {
                            self.selectClearPassenger.splice(i, 1)
                        }
                    })
                }
                if (checkBoxAll == self.checkedNum) {
                    $(".check-box").eq(0).addClass("active");
                }
                console.log(self.selectClearPassenger);
            },
            openUserMessage: function (event) {
                this.userMessageFlag = true;
                this.currentUserMessage = list;
            },
            closeUserMessage: function () {
                this.userMessageFlag = false
            },
            deletePassenger: function () {
                var self = this;
                var params = [];
                self.selectClearPassenger.forEach(function (list, index) {
                    params[index] = {};
                    params[index].name = list.passengerName;
                    params[index].identityNo = list.passengerId;
                })
                console.log(params);
                servers.deletePassengers(params, function (response) {
                    console.log(response);
                    self.performSuccessCallback(response);
                })
            },
            removeLeavePassengers: function () {
                var self = this
                var informlists = JSON.parse(sessionStorage.getItem('passenger_lists'));
                var params = [];
                informlists.forEach(function (list, index) {
                    params[index] = {};
                    params[index].name = list.passengerName;
                    params[index].identityNo = list.passengerId;
                })
                servers.leavePassengersCleared(params, function (response) {
                    console.log(response);
                    self.performSuccessCallback(response);
                })
            },
            performSuccessCallback: function (res) {
                var response = res.json();
                var self = this;
                self.searchTerms.flag = false;
                self.searchTerms.waitingSpace = '';
                self.searchTerms.informState = '';
                self.searchTerms.informNumber = '';
                self.waitingSpace = '候补舱位';
                self.informState = '通知状态';
                self.informNumber = '通知次数';
                $(".check-box").removeClass("active");
                self.lists.forEach(function (r) {
                    response.forEach(function (el, i) {
                        if (r.identityNo == el.passengerId) {
                            self.lists.splice(i, 1);
                        }
                    })
                })
                sessionStorage.setItem('passenger_lists', JSON.stringify(self.lists));
            },
//            rendList: function (waitingSpace, informState, informNumber) {
//                var arr = [];
////                var lists = JSON.parse(sessionStorage.getItem('passenger_lists'));
//                this.lists.forEach(function (list) {
//                    var requiredArray = list.requiredSeatClass.join();
//                    if (informState != '' && informNumber != '') {
//                        if (informState == '已通知' && informNumber == '一次以上') {
////           if(  (waitingSpace == ""?1:self.shippingSpaceMatch[waitingSpace].indexOf(list.requiredArray) > -1)&&&& list.noticedFlights.length>=1){
////                    arr.push(list);
////                }
//                            if (requiredArray.indexOf(waitingSpace) > -1 && list.noticedFlights.length >= 1) {
//                                arr.push(list);
//                            }
//                        }
//                        if (informState == '已通知' && informNumber == '三次以上') {
//                            if (requiredArray.indexOf(waitingSpace) > -1 && list.noticedFlights.length >= 3) {
//                                arr.push(list);
//                            }
//                        }
//                        if (informState == '已通知' && informNumber == '五次以上') {
//                            if (requiredArray.indexOf(waitingSpace) > -1 && list.noticedFlights.length >= 5) {
//                                arr.push(list);
//                            }
//                        }
//                    } else if (informState != '' && informNumber == '') {
//                        if (informState == '已通知') {
//                            if (requiredArray.indexOf(waitingSpace) > -1 && list.noticedFlights.length > 0) {
//                                arr.push(list);
//                            }
//                        }
//                        if (informState == '未通知') {
//                            if (requiredArray.indexOf(waitingSpace) > -1 && list.noticedFlights.length == 0) {
//                                arr.push(list);
//                            }
//                        }
//                    } else if (informState == '' && informNumber != '') {
//                        if (informNumber == '一次以上') {
//                            if (requiredArray.indexOf(waitingSpace) > -1 && list.noticedFlights.length >= 1) {
//                                arr.push(list);
//                            }
//                        }
//                        if (informNumber == '三次以上') {
//                            if (requiredArray.indexOf(waitingSpace) > -1 && list.noticedFlights.length >= 3) {
//                                arr.push(list);
//                            }
//                        }
//                        if (informNumber == '五次以上') {
//                            if (requiredArray.indexOf(waitingSpace) > -1 && list.noticedFlights.length >= 5) {
//                                arr.push(list);
//                            }
//                        }
//                    } else {
//                        if (requiredArray.indexOf(waitingSpace) > -1) {
//                            arr.push(list);
//                        }
//                    }
//                });
//                this.lists = arr;
//            },
            altnatereSpace: function (item) {
                var self = this;
                this.searchTerms.flag = true;
                this.waitingSpace = item;
                this.waitingSpaceVal = item;
                this.searchTerms.waitingSpace = self.waitingSpace;
//                this.rendList(this.searchTerms.waitingSpace, this.searchTerms.informState, this.searchTerms.informNumber);
            },
            infoStatus: function (status) {
                var self = this;
                this.searchTerms.flag = true;
                this.informState = status;
                this.informStateVal = status;
                this.searchTerms.informState = self.informState;
                if (status == '未通知') {
                    this.informNumber = '通知次数';
                    this.searchTerms.informNumber = '';
                }
             //   this.rendList(this.searchTerms.waitingSpace, this.searchTerms.informState, this.searchTerms.informNumber);
            },
            infoNumber: function (number) {
                var self = this;
                this.searchTerms.flag = true;
                this.informNumber = number;
                this.informNumberVal=number;
                this.informState = '已通知';
                this.searchTerms.informState = '已通知';
                this.searchTerms.informNumber = self.informNumber;
               // this.rendList(this.searchTerms.waitingSpace, this.searchTerms.informState, this.searchTerms.informNumber);
            },
            deleteSelect: function (select) {
                this.searchTerms[select] = '';
                if (this.searchTerms.waitingSpace == '') {
                    this.waitingSpace = '候补舱位';
                    this.waitingSpaceVal="";
                }
                if (this.searchTerms.informState == '') {
                    this.informState = '通知状态';
                    this.informStateVal="";
                }
                if (this.searchTerms.informNumber == '') {
                    this.informNumber = '通知次数';
                    this.informNumberVal=""
                }
                if (this.searchTerms.waitingSpace == '' && this.searchTerms.informState == '' && this.searchTerms.informNumber == '') {
                    this.searchTerms.flag = false;
                    this.waitingSpace = '候补舱位';
                    this.waitingSpaceVal="";
                    this.informState = '通知状态';
                    this.informStateVal="";
                    this.informNumber = '通知次数'
                    this.informNumberVal="";
                }
             //   this.rendList(this.searchTerms.waitingSpace, this.searchTerms.informState, this.searchTerms.informNumber);

            },
            deleteAll: function () {
                var self = this;
                this.searchTerms.flag = false;
                this.searchTerms.waitingSpace = '';
                this.searchTerms.informState = '';
                this.searchTerms.informNumber = '';
                this.waitingSpace = '候补舱位';
                this.waitingSpaceVal = '';
                this.informState = '通知状态';
                this.informStateVal="";
                this.informNumber = '通知次数';
                this.informNumberVal="";
             //   this.rendList(this.searchTerms.waitingSpace, this.searchTerms.informState, this.searchTerms.informNumber);

            },
            personWatch: function () {
                var self = this;
                self.viewFromAirport = self.fromAirport;
                self.viewToAirport = self.toAirport;
                this.passengerViewFlag = true;
                var windowHeight = $(window).height();
                var maxHeight = $(".fixed-wrap .scroll-max-height-wrap");
                maxHeight.height(windowHeight - maxHeight.offset().top);
            },
            closeView: function () {
                var self = this;
                self.passengerViewFlag = false;
                self.username = "";
                var from1 = this.viewFromAirport;
                var to1 = this.viewToAirport;
                self.fromAirport = from1;
                self.toAirport = to1;
//                var lists = JSON.parse(sessionStorage.getItem('passenger_lists'));
//                this.lists = lists;
            },
            deleteQueryName: function () {
                this.username = "";
                var lists = JSON.parse(sessionStorage.getItem('passenger_lists'));
                this.lists = lists;
            },
            searchPassenger: function (event) {
                var self = this;
                var username = this.username
                var from1 = this.viewFromAirport;
                var to1 = this.viewToAirport;
                if (from1 && to1) {
                    var params = {
                        "date": self.queryDate,
                        "fromAirportCode": self.fromAirport,
                        "toAirportCode": self.toAirport
                    }
//                    servers.waitingPassengerList(params, function (res) {
//                        self.passengerList(res);
//                    })
//                    self.searchPassengerCallback();
//                } else {
//                    popover.toast({message: "出发机场或到达机场不能为空"})
//                    return;
               }
            },
//            searchPassengerCallback: function () {
//                var self = this;
//                if (self.username == "") {
//                    popover.toast({message: "请输入姓名"});
//                    return;
//                }
//                self.lists = _.filter(self.lists, (l) = > {
//                        return l.passengerName == self.username;
//                });
//                if (self.lists.length == 0) {
//                    popover.toast({message: "未查询到该人信息"})
//                }
//            },
            informNumAlert: function (el) {
                var self = this;
                self.numberAlertFlag = true;
            },
            closeInformAlert: function () {
                this.numberAlertFlag = false;
            },
            selectCertificateList: function (l) {
                this.certificateType = l;
            },
            frequentRankList: function (l) {
                this.frequentRank = l;
            },
            ticketInfo: function () {
                this.blackScreenDisplayFlag = true;

            },
            savePassengerInfo: function (el) {
                var self = this;
                self.userMessageFlag = false;
                var current = $(el.currentTarget).parent(".modify-show").siblings(".scroll-list");
                var params = [];
                params[0] = {};
                params[0].identityNo = current.find(".credentials").val();
                params[0].name = current.find(".nameInfo").val();
                params[0].contact = current.find(".contact").val();
                params[0].fromAirportCode = current.find(".fromOrigin").text();
                params[0].toAirportCode = current.find(".toOrigin").text();
                console.log(params);
                servers.modifyWaitingInformation(params, function (res) {
                    var response = res.json();
                    console.log(response);
//              console.log(response[0].resultCode)
//              if(response[0].resultCode==0){
//                  popover.toast({message:"返回错误数据"})
//                  return;
//              }
                })
            },
            cancelPassengerInfo: function () {
                this.userMessageFlag = false;
            },
            confirmDisplayInfo: function () {
                this.blackScreenDisplayFlag = false;
            },
            cancelDisplayInfo: function () {
                this.blackScreenDisplayFlag = false;
            },
            showDetailsFlights:function(l){
           console.log(l);
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
        }
    }
</script>
<style scoped>
    .mu-row {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .padding-row {
        padding-left: 20px;
        padding-right: 20px;
    }

    .main {
        padding: 20px 20px 0 20px;
    }

    /*Start Main*/

    /*Main End*/
    .delete-btn {
        cursor: pointer;
        position: absolute;
        margin-left: 240px;
        margin-top: -22px;
    }

    .slide-down-btn .dropdown {
        margin-right: 20px;
    }

    .select-end-create-icon p {
        float: left;
        margin-right: 10px;
        height: 20px;
        line-height: 20px;
        border-radius: 20px;
        padding: 0 5px;
    }

    .select-end-create-icon .icon {
        color: #fff;
    }

    .select-end-create-icon .text {
        padding-right: 40px;
    }

    .select-end-create-icon a {
        color: #fe5f4a;
    }

    .text-left {
        text-align: left;
    }

    .check-box {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("../assets/images/checked.png") no-repeat right;
        vertical-align: middle;
    }

    .state-btn {
        color: #fff;
    }

    .icon-btn {
        width: 40px;
    }

    .text-btn {
        width: 100px;
    }

    .clear-all {
        color: #fd5c48;
        background: transparent;
        border-color: #fd5c48;
    }

    .btn-group {
        margin-left: 20px;
    }

    .scroll-col li {
        width: 8.3%;
        text-align: center;
        line-height: 50px;
    }

    .scroll-col .line-two {
        line-height: 25px;
    }

    .scroll-col .check {
        text-align: left;
        width: 5%;
    }

    #cont .scroll-col .lone {
        width: 14%;
    }

    .name a {
        color: #000;
    }

    .width-140 {
        height: auto;
    }

    .form-inline {
        margin-top: 4px;
    }

    .once-border {
        border-top: 1px solid #ccc;
        width: 40px;
        margin: 0 10px;
    }

    .form-inline label {
        font-weight: normal;
    }

    .form-inline .bg-deep-blue {
        margin-left: -4px;
    }

    .fixed-wrap {
        position: fixed;
        top: 0;
        right: 0;
        height: 100%;
        z-index: 678;
    }

    .fixed-wrap .scroll-col li {
        width: 14%;
    }

    .scroll-col .lone {
        width: 15%;
    }

    .margin-right-20 {
        margin-right: 20px;
    }

    #user-message {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .4);
        z-index: 999;
    }

    #user-message .col-xs-3 {
        line-height: 30px;
    }

    .user-wrap {
        width: 73%;
        padding: 33px 0;
        height: 640px;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        overflow: hidden;
    }

    .user-title {
        margin-top: 30px;
        margin-bottom: 20px;
        color: #4177cd;
        padding-left: 30px;
        background-repeat: no-repeat;
        background-position: left center;
        font-size: 16px;
    }

    .one {
        background-image: url("../assets/images/infomation_.png");
    }

    .two {
        background-image: url("../assets/images/ticket.png");
    }

    .three {
        background-image: url("../assets/images/record2.png");
    }

    .header {
        color: #959da0;
    }

    #user-message .close-btn {
        padding: 5px;
        /*border: 1px solid #eeeff4;*/
        position: absolute;
        right: -1px;
        top: -1px;
    }

    .scroll-list {
        width: 100%;
        height: 538px;
        overflow: auto;
        padding: 0 80px;
    }

    #user-message .user-wrap > .text-center {
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

    .col-xs-6 .col-xs-7 {
        line-height: 30px;
    }

    .search-box {
        width: 73%;
        height: 78%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
    }

    #number-alert .padding-row, #find .padding-row {
        padding-left: 30px;
    }

    #number-alert .mu-row, #find .mu-row {
        padding-top: 20px;
        padding-bottom: 20px;
        box-shadow: 0 0 5px #eeeff4;
    }

    .person-list.mu-row {
        padding-top: 0;
    }

    .plane-search-title span {
        margin-right: 15px;
    }

    .plane-search-title .tit {
        color: #4483ea;
        font-size: 16px;
    }

    .close-btn {
        padding: 20px 20px;
        position: absolute;
        right: 0;
        top: 0;
    }

    #number-alert .person-list.mu-row, #find .person-list.mu-row {
        padding-top: 0;
    }

    #find .person-list.mu-row {
        height: 410px;
        overflow: auto;
    }

    #number-alert .scroll-col .col-xs-20, #find .scroll-col .col-xs-20 {
        line-height: 50px;
    }

    #number-alert .scroll-col li, #find .scroll-col li {
        float: left;
        text-align: center;
    }

    #number-alert .col-xs-20, #find .col-xs-20 {
        width: 20%;
        float: left;
        min-height: 1px;
    }

    .pos-rel {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }

    .text-center .border-deep-blue {
        margin-left: 15px;
    }

    .col-xs-6 .dropdown .btn {
        width: 100%;
    }

    .wrap .col-xs-11.form-inline .col-xs-6 input {
        width: 70%;
    }

    .min-1280 {
        width: 45%;
    }

    .hasMarginTop {
        margin-top: 4px;
    }

    .state-btn > .pull-left {
        color: #000;
    }

    .state-btn > .pull-left .form-control {
        display: inline-block;
        width: auto;
    }

    .once-border1 {
        border-top: 1px solid #ccc;
        width: 6%;
        margin: 0 1%;
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

    .save {
        text-align: center !important;
    }

    .cancel {
        border: 1px solid #4483ea !important;
        color: #4377cb !important;
    }
    .loneList{
        height: 50px;
        line-height: 50px;
        display: inline-block;
        text-align: center;
    }
    .lone .flightLine{
        color: #4377cb !important;
        font-weight: bolder;
        /*border: 1px solid  red ;*/
    }
</style>

