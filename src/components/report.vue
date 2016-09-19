<template>
    <div class="container-fluid">
        <!--Start Left Menu-->
        <left-menu :tabobj='tabObj'></left-menu>
        <!--Left Menu End-->
        <div class="main col-xs-11 bg-gray" :style="{ paddingTop: mainPaddingTop + 'px'} ">
            <div class="r-header bg-white padding-row mu-row noprint">
                <div class="search">
                    <div class="form clearfix padding-row mu-row">
                        <div class="col-xs-11 clearfix form-inline">
                            <div class="form-group col-xs-3">
                                <label for="header-1">航班号 : </label>
                                <input type="text" id="header-1" class="form-control"
                                       v-model="flightNo"
                                       onkeyup="value=value.toUpperCase()"
                                       @keyup.enter="searchReport">
                            </div>
                            <div class="form-group col-xs-3">
                                <label for="header-2">日期 : </label>
                                <input type="text" id="header-2" class="form-control search-date" v-model="date" readonly>
                            </div>
                            <div class="form-group col-xs-3 middle">
                                <label for="header-3">旅客姓名 : </label>
                                <input type="text" id="header-3" class="form-control" v-model="name"
                                       @keyup.enter="searchReport">
                            </div>
                            <div class="form-group col-xs-3 last">
                                <label for="header-4">证件号 : </label>
                                <input type="text" id="header-4" class="form-control" v-model="identityNo"
                                       @keyup.enter="searchReport">
                            </div>
                        </div>
                        <div class="col-xs-1 text-right">
                            <button class="btn bg-deep-blue" @click="searchReport"><img src="../assets/images/search-white.png" alt=""></button>
                        </div>
                    </div>
                </div>
                <div class="submit-work clearfix padding-row">
                    <div class="pull-right">
                        <div class="btn-group">
                            <button class="btn bg-deep-blue">导 出</button>
                            <button class="btn bg-deep-blue" @click="print">打 印</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tabs">
                    <!-- Nav tabs -->
                    <ul class="nav nav-tabs" role="tablist">
                        <li role="presentation" class="active"><a href="#inform" role="tab" data-toggle="tab">候补通知</a></li>
                        <li role="presentation"><a href="#involuntary" role="tab" data-toggle="tab">非自愿升舱</a></li>
                        <li role="presentation"><a href="#volunteer" role="tab" data-toggle="tab">志愿者选择</a></li>
                    </ul>
                    <!-- Tab panes -->
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="inform">
                            <div class="waiting-list padding-row bg-white">
                                    <!--<div class="list-header">-->
                                        <!--<h3 class="title">-->
                                            <!--{{currentFlight}}<small>{{currentDate}}</small>-->
                                        <!--</h3>-->
                                    <!--</div>-->
                                    <ul class="scroll-row">
                                        <li class="scroll-header">
                                            <ul class="clearfix scroll-col">
                                                <li><a href="javascript:void(0)" class="level" @click="informLevel=-informLevel">序号</a>
                                                    <img src="../assets/images/arrow.png" alt="" v-show="informLevel == 1">
                                                    <img src="../assets/images/arrow-down.png" alt="" v-show="informLevel == -1"></li>
                                                <li>姓名</li>
                                                <li>常客等级</li>
                                                <li>候补时间</li>
                                                <li>候补舱位</li>
                                                <li>客票舱位</li>
                                                <li>候补备注</li>
                                                <li>通知状态</li>
                                                <li>操作说明</li>
                                                <li>操作日志</li>
                                            </ul>
                                        </li>
                                        <li v-for="item in list1 | orderBy 'id' informLevel">
                                            <ul class="clearfix scroll-col">
                                                <li>{{item.id}}</li>
                                                <li>{{item.name}}</li>
                                                <li>{{item.level}}</li>
                                                <li>{{item.time}}</li>
                                                <li>{{item.seatNew}}</li>
                                                <li>{{item.seatOld}}</li>
                                                <li>{{item.remark}}</li>
                                                <li>{{item.status}}</li>
                                                <li class="tooltips-top tooltips-info" data-tooltips="回车保存"><input type="text" class="form-control" v-model="item.comment" value="" /></li>
                                                <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                            </ul>
                                        </li>
                                        <!--<li>-->
                                        <!--<ul class="clearfix scroll-col">-->
                                        <!--<li>1</li>-->
                                        <!--<li>李一</li>-->
                                        <!--<li>V</li>-->
                                        <!--<li>06:00</li>-->
                                        <!--<li>Y</li>-->
                                        <!--<li>F</li>-->
                                        <!--<li>备注信息</li>-->
                                        <!--<li>已通知</li>-->
                                        <!--<li><input type="text" class="form-control" /></li>-->
                                        <!--<li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>-->
                                        <!--</ul>-->
                                        <!--</li>-->
                                    </ul>
                                </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="involuntary">
                            <div class="limit-involuntary-list padding-row bg-white" >
                                    <!--<div class="list-header">-->
                                        <!--<h3 class="title">-->
                                            <!--{{currentFlight}}<small>{{currentDate}}</small>-->
                                        <!--</h3>-->
                                    <!--</div>-->
                                    <ul class="scroll-row">
                                        <li class="scroll-header">
                                            <ul class="clearfix scroll-col">
                                                <li>
                                                    <a href="javascript:void(0)" class="level" @click="upgradeLevelToggle">序号</a>
                                                    <img src="../assets/images/arrow.png" alt="" v-show="upgradeLevel">
                                                    <img src="../assets/images/arrow-down.png" alt="" v-show="!upgradeLevel">
                                                </li>
                                                <li>姓名</li>
                                                <li>常客等级</li>
                                                <li>舱位</li>
                                                <li>特殊服务</li>
                                                <li>联程</li>
                                                <li>同行</li>
                                                <li>值机登机状态</li>
                                                <li>操作</li>
                                                <li>操作说明</li>
                                                <li>操作日志</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul class="clearfix scroll-col">
                                                <li>1</li>
                                                <li>林一</li>
                                                <li>V</li>
                                                <li>J</li>
                                                <li>NSSW</li>
                                                <li>是</li>
                                                <li>&nbsp;</li>
                                                <li>已登机</li>
                                                <li>升至O舱</li>
                                                <li><input type="text" class="form-control" value="for 林一" /></li>
                                                <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul class="clearfix scroll-col">
                                                <li>2</li>
                                                <li>林二</li>
                                                <li>V</li>
                                                <li>J</li>
                                                <li>NSSW</li>
                                                <li>是</li>
                                                <li>&nbsp;</li>
                                                <li>已登机</li>
                                                <li>升至O舱</li>
                                                <li><input type="text" class="form-control" value="for 林一" /></li>
                                                <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul class="clearfix scroll-col">
                                                <li>3</li>
                                                <li>林三</li>
                                                <li>V</li>
                                                <li>J</li>
                                                <li>NSSW</li>
                                                <li>是</li>
                                                <li>&nbsp;</li>
                                                <li>已登机</li>
                                                <li>升至O舱</li>
                                                <li><input type="text" class="form-control" value="for 林一" /></li>
                                                <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul class="clearfix scroll-col">
                                                <li>4</li>
                                                <li>林四</li>
                                                <li>V</li>
                                                <li>J</li>
                                                <li>NSSW</li>
                                                <li>是</li>
                                                <li>&nbsp;</li>
                                                <li>已登机</li>
                                                <li>升至O舱</li>
                                                <li><input type="text" class="form-control" value="for 林一" /></li>
                                                <li><button class="btn bg-white border-deep-blue" @click="showLogDialog()">查 看</button></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul class="clearfix scroll-col">
                                                <li>120</li>
                                                <li>林五</li>
                                                <li>V</li>
                                                <li>J</li>
                                                <li>NSSW</li>
                                                <li>是</li>
                                                <li>&nbsp;</li>
                                                <li>已登机</li>
                                                <li>志愿者选择</li>
                                                <li><input type="text" class="form-control" value="for 林一" /></li>
                                                <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul class="clearfix scroll-col">
                                                <li>121</li>
                                                <li>林六</li>
                                                <li>V</li>
                                                <li>J</li>
                                                <li>NSSW</li>
                                                <li>是</li>
                                                <li>&nbsp;</li>
                                                <li>已登机</li>
                                                <li>志愿者选择</li>
                                                <li><input type="text" class="form-control" value="for 林一" /></li>
                                                <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <ul class="clearfix scroll-col">
                                                <li>122</li>
                                                <li>林气</li>
                                                <li>V</li>
                                                <li>J</li>
                                                <li>NSSW</li>
                                                <li>是</li>
                                                <li>&nbsp;</li>
                                                <li>已登机</li>
                                                <li>志愿者选择</li>
                                                <li><input type="text" class="form-control" value="for 林一" /></li>
                                                <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="volunteer">
                            <div class="limit-involuntary-list padding-row bg-white">
                                <!--<div class="list-header">-->
                                    <!--<h3 class="title">-->
                                        <!--{{currentFlight}}<small>{{currentDate}}</small>-->
                                    <!--</h3>-->
                                <!--</div>-->
                                <ul class="scroll-row">
                                    <li class="scroll-header">
                                        <ul class="clearfix scroll-col">
                                            <li>
                                                <a href="javascript:void(0)" class="level" @click="upgradeLevelToggle">序号</a>
                                                <img src="../assets/images/arrow.png" alt="" v-show="upgradeLevel">
                                                <img src="../assets/images/arrow-down.png" alt="" v-show="!upgradeLevel">
                                            </li>
                                            <li>姓名</li>
                                            <li>常客等级</li>
                                            <li>舱位</li>
                                            <li>特殊服务</li>
                                            <li>联程</li>
                                            <li>同行</li>
                                            <li>值机登机状态</li>
                                            <li>操作</li>
                                            <li>操作说明</li>
                                            <li>操作日志</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <ul class="clearfix scroll-col">
                                            <li>120</li>
                                            <li>林五</li>
                                            <li>V</li>
                                            <li>J</li>
                                            <li>NSSW</li>
                                            <li>是</li>
                                            <li>&nbsp;</li>
                                            <li>已登机</li>
                                            <li>志愿者选择</li>
                                            <li><input type="text" class="form-control" value="for 林一" /></li>
                                            <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <ul class="clearfix scroll-col">
                                            <li>121</li>
                                            <li>林六</li>
                                            <li>V</li>
                                            <li>J</li>
                                            <li>NSSW</li>
                                            <li>是</li>
                                            <li>&nbsp;</li>
                                            <li>已登机</li>
                                            <li>志愿者选择</li>
                                            <li><input type="text" class="form-control" value="for 林一" /></li>
                                            <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <ul class="clearfix scroll-col">
                                            <li>122</li>
                                            <li>林气</li>
                                            <li>V</li>
                                            <li>J</li>
                                            <li>NSSW</li>
                                            <li>是</li>
                                            <li>&nbsp;</li>
                                            <li>已登机</li>
                                            <li>志愿者选择</li>
                                            <li><input type="text" class="form-control" value="for 林一" /></li>
                                            <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <ul class="clearfix scroll-col">
                                            <li>1</li>
                                            <li>林一</li>
                                            <li>V</li>
                                            <li>J</li>
                                            <li>NSSW</li>
                                            <li>是</li>
                                            <li>&nbsp;</li>
                                            <li>已登机</li>
                                            <li>升至O舱</li>
                                            <li><input type="text" class="form-control" value="for 林一" /></li>
                                            <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <ul class="clearfix scroll-col">
                                            <li>2</li>
                                            <li>林二</li>
                                            <li>V</li>
                                            <li>J</li>
                                            <li>NSSW</li>
                                            <li>是</li>
                                            <li>&nbsp;</li>
                                            <li>已登机</li>
                                            <li>升至O舱</li>
                                            <li><input type="text" class="form-control" value="for 林一" /></li>
                                            <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <ul class="clearfix scroll-col">
                                            <li>3</li>
                                            <li>林三</li>
                                            <li>V</li>
                                            <li>J</li>
                                            <li>NSSW</li>
                                            <li>是</li>
                                            <li>&nbsp;</li>
                                            <li>已登机</li>
                                            <li>升至O舱</li>
                                            <li><input type="text" class="form-control" value="for 林一" /></li>
                                            <li><button class="btn bg-white border-deep-blue callLog" @click="showLogDialog()">查 看</button></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <ul class="clearfix scroll-col">
                                            <li>4</li>
                                            <li>林四</li>
                                            <li>V</li>
                                            <li>J</li>
                                            <li>NSSW</li>
                                            <li>是</li>
                                            <li>&nbsp;</li>
                                            <li>已登机</li>
                                            <li>升至O舱</li>
                                            <li><input type="text" class="form-control" value="for 林一" /></li>
                                            <li><button class="btn bg-white border-deep-blue" @click="showLogDialog()">查 看</button></li>
                                        </ul>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
    <div id="association-passengers" v-show="logShow">
        <div class="ap-wrap bg-white">
            <div class="ap-header">
                <h4>旅客操作日志</h4>
                <a href="javascript:;" class="ap-close-btn hide-ap" @click="logShow = false">
                    <img src="../assets/images/closelight2@.png" alt="">
                </a>
            </div>
            <div class="u-message clearfix">
                <p class="pull-left">姓名 : 李二</p>
                <p class="pull-left">证件号 : 210222333300001919</p>
                <p class="pull-left">航班号 : MU9103</p>
                <p class="pull-left">日期 : 2016-09-07</p>
            </div>
            <ul class="scroll-row">
                <li class="scroll-header">
                    <ul class="clearfix scroll-col">
                        <li>时间</li>
                        <li>操作员</li>
                        <li>操作</li>
                        <li>操作说明</li>
                    </ul>
                </li>
                <li class="list-line">
                    <ul class="clearfix scroll-col">
                        <li>06:00</li>
                        <li>SY1122</li>
                        <li>修改联系电话</li>
                        <li> </li>
                    </ul>
                </li>
                <li class="list-line">
                    <ul class="clearfix scroll-col">
                        <li>07:00</li>
                        <li>LY3344</li>
                        <li>升至O舱</li>
                        <li> </li>
                    </ul>
                </li>
                <li class="list-line">
                    <ul class="clearfix scroll-col">
                        <li>08:00</li>
                        <li>QL5566</li>
                        <li>添加操作说明</li>
                        <li>For 李梨</li>
                    </ul>
                </li>
                <li class="list-line">
                    <ul class="clearfix scroll-col">
                        <li>09:00</li>
                        <li>SF7788</li>
                        <li>修改操作说明</li>
                        <li>For 孙笋</li>
                    </ul>
                </li>
            </ul>
            <div class="ap-operation text-center">
                <button class="btn border-deep-blue bg-white hide-ap" @click="logShow = false">关 闭</button>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import leftMenu from "./leftMenu.vue";
    import _ from "lodash";
    import servers from "../servers.js";
    import popover from "../assets/commonjs/popover.js";

    export default{
        components: {
            leftMenu
        },
        data: function () {
            return {
                tabObj: {           // 右侧菜单对象
                    report: true    // 选中报表项
                },
                mainPaddingTop: 114,
                informLevel: 1,
                upgradeLevel: 1,
                flightNo: 'MU9103',         // 航班号
                currentFlight: 'MU9103',
                date: '',         // 日期
                currentDate: '2016-09-07',  // 当前搜索的日期
                name: '',           // 旅客姓名
                identityNo: '',     // 证件号
                informList: [],     // 候补通知列表
                upgradeList: [],    // 升舱列表
                logShow: false,     // 旅客操作日志弹窗显示状态
                order1: 1,
                list1: [
                    {
                        id: 1,
                        name: '李一',
                        level: 'V',
                        time: '06:00',
                        seatNew: 'Y',
                        seatOld: 'F',
                        remark: '备注信息',
                        status: '已通知',
                        instruction: '',
                        showRemarkTextFlag: false,
                        comment: ''
                    },
                    {
                        id: 2,
                        name: '李二',
                        level: 'V',
                        time: '06:00',
                        seatNew: 'Y',
                        seatOld: 'F',
                        remark: '备注信息',
                        status: '已通知',
                        instruction: '',
                        showRemarkTextFlag: false,
                        comment: ''
                    }
                ]
            };
        },
        methods: {
            /**
             * 打印报表
             */
            print: function () {
                $(".noprint").hide();
                $(".main").css({
                    'width': '100%',
                    'padding-top': '0'
                });
                this.$parent.$el.style.overflow = "auto";
                this.$parent.$el.style.height = "auto";
                this.$children[0].$el.style.display = "none";
                window.print();
                $("body").removeAttr("style");
                $(".main").removeAttr("style");
                $(".noprint").removeAttr("style");
                $(".menu").removeAttr("style");
            },
            /**
             * 查看操作日志弹窗
             * @param obj
             */
            showLogDialog: function (obj) {
                this.logShow = true;
            },
            /**
             * 报表搜索事件以及校验
             */
            searchReport: function () {
                if(!this.flightNo) {
                    popover.toast({message: "请输入要搜索的航班号"});
                } else if(!this.date) {
                    popover.toast({message: "请选择搜索日期"});
                } else {
                    popover.toast({message: "暂无数据！"});
                }
            },
            toggleTextarea: function (item, e) {
                item.showRemarkTextFlag = !item.showRemarkTextFlag;
                console.log(item.showRemarkTextFlag);
            }

        },
        ready: function () {
            var self = this;
            var now = new Date();
            var month = now.getMonth() + 1;
            this.date = now.getFullYear() + "-" + ((month > 9) ? month : ('0' + month)) + "-" + now.getDate();

            $(".r-header").css("width",$(".main").width());
            self.mainPaddingTop = $(".r-header").height() + 60;
            window.onresize=function(){
                $(".r-header").css("width",$(".main").width());
                self.mainPaddingTop = $(".r-header").height() + 60;
            };


            // 日期控件初始化
            $('.search-date').datetimepicker({
                minView: "month",       //选择日期后，不会再跳转去选择时分秒
                autoclose: true,        // 选择一个日期之后立即关闭此日期选择器
                format: 'yyyy-mm-dd',   // 格式化日期
                todayBtn: true,         // 选中当天日期
                keyboardNavigation: true // 允许通过方向键改变日期
            });
        }
    }
</script>

<style scoped>
    .main {
        padding: 114px 20px 20px 20px;
        position: relative;
    }
    .padding-row{
        padding-left: 20px;
        padding-right: 20px;
    }
    .mu-row{
        padding-top:10px;
        padding-bottom:10px;
    }
    /*Header    S*/
    .r-header .form-control{
        width: 70%;
    }
    .form .col-xs-1 .btn{
        width: 80%;
    }
    /*Header    E*/
    .submit-work{
        margin-top:10px;
        margin-bottom:10px;
        display: none;
    }
    .submit-work p{
        display: inline-block;
        margin-right:20px;
        line-height: 34px;
    }
    .submit-work p a{
        margin-right: 10px;
    }
    .main .submit-work .btn{
        margin-left:20px;
    }
    .btn-group .btn{
        width: 120px;
    }
    .border-deep-blue{
        color: #4377cb;
    }
    .r-header{
        position: absolute;
        width: 100%;
        top:20px;
        left: 20px;
    }
    .height-100{
        height: 100%;
        overflow: auto;
    }
    .list-header{
        padding-top:30px;
        padding-bottom:30px;
        border-bottom:3px solid #eeeff4;
    }
    .list-header h3{
        font-size: 16px;
    }
    .list-header span{
        margin-right:20px;
    }
    .list-header small{
        color: #000;
        font-size: 14px;
        vertical-align: bottom;
        margin-left:20px;
    }
    .waiting-list{
        /*height: 49.5%;*/
        overflow: auto;
    }
    .waiting-list .scroll-col li{
        width: 10%;
        text-align: center;
        line-height: 50px;
    }
    .limit-involuntary-list{
        overflow: auto;
    }
    .limit-involuntary-list .scroll-col li{
        width: 9.09090909%;
        text-align: center;
        line-height: 50px;
    }
    .form-control{
        display: inline-block;
    }

    .u-message{
        padding:24px 27px;
    }
    .ap-operation{
        position: absolute;
        width: 100%;
        bottom: 0;
        box-shadow:0 0 5px #eeeff4;
        margin: 0;
    }
    .ap-close-btn {
        position: absolute;
        right: 10px;
        top: 11px;
        width: 40px;
        height: 40px;
        text-align: center;
    }
    #association-passengers .scroll-col li{
        width: 25%;
        text-align: center;
        line-height: 50px;
    }
    .u-message p{
        margin-right:40px;
    }
    .search-date {
        background: #fff;
    }
    .tabs {
        height: 100%;
        overflow: hidden;
    }
    .tab-content {
        height: 100%;
        overflow: auto;
        padding-bottom: 42px;
    }
    .scroll-row > li:last-child {
        border-bottom: 0;
    }
    .border-orange{
        color: #BE841B;
        border:1px solid #DDB670;
        position: relative;
    }
    .mark-end{
        background-image: url("../assets/images/botton_triangle.png");
        background-position: top right;
        background-repeat: no-repeat;
    }
    .scroll-col .long {
        width: 14%;
        min-height: 1px;
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
    }
    .call-slide-content textarea{
        width: 100%;
        margin-bottom:10px;
        resize: none;
        border-color:#eeeff4;
    }

</style>
