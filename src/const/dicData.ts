export const alarmLevelDic = [
    {
        label: "蓝色",
        value: "10"
    },
    {
        label: "黄色",
        value: "20"
    },
    {
        label: "橙色",
        value: "30"
    },
    {
        label: "红色",
        value: "40"
    }
];

export const alarmLevelMap = {
    10: "蓝色",
    20: "黄色",
    30: "橙色",
    40: "红色"
};

export const pushWayList = [
    {
        label: "政务微信",
        value: "政务微信"
    },
    {
        label: "短信",
        value: "短信"
    },
    {
        label: "网页",
        value: "网页"
    }
];

//转发方式
export const pushModeDic = [
    {
        label: "自动",
        value: "自动"
    },
    {
        label: "手动",
        value: "手动"
    }
];

export const carInOutDic = [
    {
        label: "驶入",
        value: "0"
    },
    {
        label: "驶出",
        value: "1"
    }
];

export const iconTypeDic = [
    {
        label: "视频",
        value: "0"
    },
    {
        label: "危化品",
        value: "1"
    },
    {
        label: "加油站",
        value: "2"
    },
    {
        label: "工地",
        value: "3"
    },
    {
        label: "出入口",
        value: "4"
    },
    {
        label: "路段",
        value: "5"
    }
];

export const alarmTree = [
    { alarmType: "数据质量", subType: ["实时", "小时", "日报", "月报"] },
    {
        alarmType: "交通",
        subType: ["客运", "泥头车", "危化品车辆", "出租", "公交站客流"]
    },
    {
        alarmType: "环境",
        subType: ["废水", "空气", "负氧离子", "地表水", null, "废气"]
    },
    {
        alarmType: "气象",
        subType: [
            "雷电",
            "大风",
            "暴雨",
            "地质灾害",
            "高温",
            "台风",
            "森林火险",
            "灰霾",
            "大雾",
            "寒冷"
        ]
    },
    { alarmType: "水情", subType: ["三防"] },
    {
        alarmType: '城市治理',
        subType: []
    },{
        alarmType: '安全生产',
        subType: []
    },{
        alarmType: '旅游',
        subType: ['沙滩']
    },{
        alarmType: '政务',
        subType: ['行为规范']
    }
];
