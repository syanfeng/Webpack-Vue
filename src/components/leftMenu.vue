<template>
    <div class="menu col-xs-1 bg-black">
        <div class="logo">
            <a href="javascript:void (0)">
                <img src="../assets/images/logo.png" alt="">
            </a>
        </div>
        <p class="title text-center">
            Menu
        </p>
        <ul class="menu-list">
            <li v-bind:class="{'active':tabobj.workbench}" @click="reloadWorkbench">
                <a  v-link="{ name: 'workbench' }">
                    <img src="../assets/images/platform.png" alt="" v-show="tabobj.workbench">
                    <img src="../assets/images/platform_n.png" alt="" v-show="!tabobj.workbench">
                    <span>工作台</span>
                </a>
            </li>
            <li v-bind:class="{'active':tabobj.registration}">
                <a  v-link="{ name: 'registration' }">
                    <img src="../assets/images/record.png" alt="" v-show="tabobj.registration">
                    <img src="../assets/images/record_n.png" alt="" v-show="!tabobj.registration">
                    <span>候补登记</span>
                </a>
            </li>
            <li v-bind:class="{'active':tabobj.passenger}">
                <a  v-link="{name:'list'}">
                    <img src="../assets/images/list.png" alt="" v-show="tabobj.passenger">
                    <img src="../assets/images/list_n.png" alt="" v-show="!tabobj.passenger">
                    <span>候补名单</span>
                </a>
            </li>
            <li v-bind:class="{'active': tabobj.report}">
                <a  v-link="{name:'report'}">
                    <img src="../assets/images/record.png" alt="" v-show="tabobj.report">
                    <img src="../assets/images/record_n.png" alt="" v-show="!tabobj.report">
                    <span>报表</span>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        props: ['tabobj'],
        methods: {
            reloadWorkbench : function () {
                console.log(this.$route.name);
                if(this.$route.name == "workbench"){
                    window.location.reload();
                }
                //this.$route.router.go({name:"workbench"});
            }
        }
    }
</script>
