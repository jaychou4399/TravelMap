import type { City } from '@/types';

// ============================================================
// City catalog — China provinces + major cities, and world cities
// Coordinates are approximate [lng, lat]
// ============================================================

export interface ChinaProvince {
  name: string;       // 省份名（与 ECharts GeoJSON 名称一致）
  cities: Omit<City, 'country' | 'countryCode' | 'province' | 'isChina'>[];
}

export const CHINA_PROVINCES: ChinaProvince[] = [
  {
    name: '北京',
    cities: [
      { id: 'cn-bj-beijing', name: '北京', nameEn: 'Beijing', lng: 116.4074, lat: 39.9042 },
    ],
  },
  {
    name: '天津',
    cities: [
      { id: 'cn-tj-tianjin', name: '天津', nameEn: 'Tianjin', lng: 117.1901, lat: 39.1252 },
    ],
  },
  {
    name: '上海',
    cities: [
      { id: 'cn-sh-shanghai', name: '上海', nameEn: 'Shanghai', lng: 121.4737, lat: 31.2304 },
    ],
  },
  {
    name: '重庆',
    cities: [
      { id: 'cn-cq-chongqing', name: '重庆', nameEn: 'Chongqing', lng: 106.5516, lat: 29.5630 },
    ],
  },
  {
    name: '河北',
    cities: [
      { id: 'cn-he-shijiazhuang', name: '石家庄', nameEn: 'Shijiazhuang', lng: 114.5149, lat: 38.0428 },
      { id: 'cn-he-chengde', name: '承德', nameEn: 'Chengde', lng: 117.9392, lat: 40.9762 },
      { id: 'cn-he-qinhuangdao', name: '秦皇岛', nameEn: 'Qinhuangdao', lng: 119.6005, lat: 39.9354 },
    ],
  },
  {
    name: '山西',
    cities: [
      { id: 'cn-sx-taiyuan', name: '太原', nameEn: 'Taiyuan', lng: 112.5489, lat: 37.8706 },
      { id: 'cn-sx-datong', name: '大同', nameEn: 'Datong', lng: 113.2953, lat: 40.0903 },
      { id: 'cn-sx-pingyao', name: '平遥', nameEn: 'Pingyao', lng: 112.1755, lat: 37.1893 },
    ],
  },
  {
    name: '辽宁',
    cities: [
      { id: 'cn-ln-shenyang', name: '沈阳', nameEn: 'Shenyang', lng: 123.429, lat: 41.7968 },
      { id: 'cn-ln-dalian', name: '大连', nameEn: 'Dalian', lng: 121.6147, lat: 38.914 },
      { id: 'cn-ln-dandong', name: '丹东', nameEn: 'Dandong', lng: 124.3537, lat: 40.0011 },
    ],
  },
  {
    name: '吉林',
    cities: [
      { id: 'cn-jl-changchun', name: '长春', nameEn: 'Changchun', lng: 125.3245, lat: 43.8868 },
      { id: 'cn-jl-yanji', name: '延吉', nameEn: 'Yanji', lng: 129.5097, lat: 42.8913 },
    ],
  },
  {
    name: '黑龙江',
    cities: [
      { id: 'cn-hlj-harbin', name: '哈尔滨', nameEn: 'Harbin', lng: 126.534, lat: 45.8038 },
      { id: 'cn-hlj-mohe', name: '漠河', nameEn: 'Mohe', lng: 122.534, lat: 52.972 },
    ],
  },
  {
    name: '江苏',
    cities: [
      { id: 'cn-js-nanjing', name: '南京', nameEn: 'Nanjing', lng: 118.7969, lat: 32.0603 },
      { id: 'cn-js-suzhou', name: '苏州', nameEn: 'Suzhou', lng: 120.5853, lat: 31.2989 },
      { id: 'cn-js-wuxi', name: '无锡', nameEn: 'Wuxi', lng: 120.3119, lat: 31.4912 },
      { id: 'cn-js-yangzhou', name: '扬州', nameEn: 'Yangzhou', lng: 119.421, lat: 32.3932 },
    ],
  },
  {
    name: '浙江',
    cities: [
      { id: 'cn-zj-hangzhou', name: '杭州', nameEn: 'Hangzhou', lng: 120.1551, lat: 30.2741 },
      { id: 'cn-zj-ningbo', name: '宁波', nameEn: 'Ningbo', lng: 121.544, lat: 29.8683 },
      { id: 'cn-zj-wenzhou', name: '温州', nameEn: 'Wenzhou', lng: 120.672, lat: 28.0006 },
      { id: 'cn-zj-zhoushan', name: '舟山', nameEn: 'Zhoushan', lng: 122.2072, lat: 29.9853 },
    ],
  },
  {
    name: '安徽',
    cities: [
      { id: 'cn-ah-hefei', name: '合肥', nameEn: 'Hefei', lng: 117.2272, lat: 31.8206 },
      { id: 'cn-ah-huangshan', name: '黄山', nameEn: 'Huangshan', lng: 118.0481, lat: 29.7147 },
    ],
  },
  {
    name: '福建',
    cities: [
      { id: 'cn-fj-fuzhou', name: '福州', nameEn: 'Fuzhou', lng: 119.2965, lat: 26.0745 },
      { id: 'cn-fj-xiamen', name: '厦门', nameEn: 'Xiamen', lng: 118.0894, lat: 24.4798 },
      { id: 'cn-fj-quanzhou', name: '泉州', nameEn: 'Quanzhou', lng: 118.5894, lat: 24.9089 },
    ],
  },
  {
    name: '江西',
    cities: [
      { id: 'cn-jx-nanchang', name: '南昌', nameEn: 'Nanchang', lng: 115.8581, lat: 28.6829 },
      { id: 'cn-jx-fuzhou', name: '抚州', nameEn: 'Fuzhou', lng: 116.3583, lat: 27.9481 },
      { id: 'cn-jx-yichun', name: '宜春', nameEn: 'Yichun', lng: 114.4162, lat: 27.8039 },
      { id: 'cn-jx-pingxiang', name: '萍乡', nameEn: 'Pingxiang', lng: 113.8544, lat: 27.6229 },
      { id: 'cn-jx-jingdezhen', name: '景德镇', nameEn: 'Jingdezhen', lng: 117.1784, lat: 29.2688 },
      { id: 'cn-jx-jiujiang', name: '九江', nameEn: 'Jiujiang', lng: 116.0013, lat: 29.7055 },
      { id: 'cn-jx-lushan', name: '庐山', nameEn: 'Lushan', lng: 115.988, lat: 29.571 },
    ],
  },
  {
    name: '山东',
    cities: [
      { id: 'cn-sd-jinan', name: '济南', nameEn: 'Jinan', lng: 117.0009, lat: 36.6758 },
      { id: 'cn-sd-qingdao', name: '青岛', nameEn: 'Qingdao', lng: 120.3826, lat: 36.0671 },
      { id: 'cn-sd-yantai', name: '烟台', nameEn: 'Yantai', lng: 121.4479, lat: 37.4638 },
      { id: 'cn-sd-taian', name: '泰安', nameEn: "Tai'an", lng: 117.0894, lat: 36.1949 },
    ],
  },
  {
    name: '河南',
    cities: [
      { id: 'cn-ha-zhengzhou', name: '郑州', nameEn: 'Zhengzhou', lng: 113.6253, lat: 34.7466 },
      { id: 'cn-ha-luoyang', name: '洛阳', nameEn: 'Luoyang', lng: 112.454, lat: 34.6197 },
      { id: 'cn-ha-kaifeng', name: '开封', nameEn: 'Kaifeng', lng: 114.3416, lat: 34.7971 },
    ],
  },
  {
    name: '湖北',
    cities: [
      { id: 'cn-hb-wuhan', name: '武汉', nameEn: 'Wuhan', lng: 114.3055, lat: 30.5928 },
      { id: 'cn-hb-yichang', name: '宜昌', nameEn: 'Yichang', lng: 111.2908, lat: 30.6925 },
    ],
  },
  {
    name: '湖南',
    cities: [
      { id: 'cn-hn-changsha', name: '长沙', nameEn: 'Changsha', lng: 112.9388, lat: 28.2278 },
      { id: 'cn-hn-zhangjiajie', name: '张家界', nameEn: 'Zhangjiajie', lng: 110.4792, lat: 29.1173 },
      { id: 'cn-hn-fenghuang', name: '凤凰', nameEn: 'Fenghuang', lng: 109.5994, lat: 27.9481 },
    ],
  },
  {
    name: '广东',
    cities: [
      { id: 'cn-gd-guangzhou', name: '广州', nameEn: 'Guangzhou', lng: 113.2644, lat: 23.1291 },
      { id: 'cn-gd-shenzhen', name: '深圳', nameEn: 'Shenzhen', lng: 114.0579, lat: 22.5431 },
      { id: 'cn-gd-zhuhai', name: '珠海', nameEn: 'Zhuhai', lng: 113.5767, lat: 22.2707 },
      { id: 'cn-gd-shantou', name: '汕头', nameEn: 'Shantou', lng: 116.6822, lat: 23.3535 },
    ],
  },
  {
    name: '海南',
    cities: [
      { id: 'cn-hi-haikou', name: '海口', nameEn: 'Haikou', lng: 110.3312, lat: 20.0311 },
      { id: 'cn-hi-sanya', name: '三亚', nameEn: 'Sanya', lng: 109.5083, lat: 18.2479 },
    ],
  },
  {
    name: '四川',
    cities: [
      { id: 'cn-sc-chengdu', name: '成都', nameEn: 'Chengdu', lng: 104.0668, lat: 30.5728 },
      { id: 'cn-sc-jiuzhaigou', name: '九寨沟', nameEn: 'Jiuzhaigou', lng: 103.9189, lat: 33.2602 },
      { id: 'cn-sc-leshan', name: '乐山', nameEn: 'Leshan', lng: 103.7722, lat: 29.5525 },
    ],
  },
  {
    name: '贵州',
    cities: [
      { id: 'cn-gz-guiyang', name: '贵阳', nameEn: 'Guiyang', lng: 106.7135, lat: 26.5783 },
      { id: 'cn-gz-kaili', name: '凯里', nameEn: 'Kaili', lng: 107.9829, lat: 26.5835 },
    ],
  },
  {
    name: '云南',
    cities: [
      { id: 'cn-yn-kunming', name: '昆明', nameEn: 'Kunming', lng: 102.8329, lat: 24.8801 },
      { id: 'cn-yn-dali', name: '大理', nameEn: 'Dali', lng: 100.2236, lat: 25.6065 },
      { id: 'cn-yn-lijiang', name: '丽江', nameEn: 'Lijiang', lng: 100.2299, lat: 26.8723 },
      { id: 'cn-yn-xishuangbanna', name: '西双版纳', nameEn: 'Xishuangbanna', lng: 100.7979, lat: 22.0087 },
    ],
  },
  {
    name: '陕西',
    cities: [
      { id: 'cn-sn-xian', name: '西安', nameEn: "Xi'an", lng: 108.9398, lat: 34.3416 },
      { id: 'cn-sn-yanan', name: '延安', nameEn: "Yan'an", lng: 109.4908, lat: 36.5966 },
    ],
  },
  {
    name: '甘肃',
    cities: [
      { id: 'cn-gs-lanzhou', name: '兰州', nameEn: 'Lanzhou', lng: 103.8343, lat: 36.0611 },
      { id: 'cn-gs-dunhuang', name: '敦煌', nameEn: 'Dunhuang', lng: 94.6619, lat: 40.1421 },
    ],
  },
  {
    name: '青海',
    cities: [
      { id: 'cn-qh-xining', name: '西宁', nameEn: 'Xining', lng: 101.7782, lat: 36.6171 },
      { id: 'cn-qh-geermu', name: '格尔木', nameEn: 'Golmud', lng: 94.9091, lat: 36.4027 },
    ],
  },
  {
    name: '台湾',
    cities: [
      { id: 'cn-tw-taipei', name: '台北', nameEn: 'Taipei', lng: 121.5654, lat: 25.033 },
      { id: 'cn-tw-kaohsiung', name: '高雄', nameEn: 'Kaohsiung', lng: 120.3014, lat: 22.6273 },
    ],
  },
  {
    name: '内蒙古',
    cities: [
      { id: 'cn-nm-hohhot', name: '呼和浩特', nameEn: 'Hohhot', lng: 111.7519, lat: 40.8414 },
      { id: 'cn-nm-hailar', name: '海拉尔', nameEn: 'Hailar', lng: 119.7362, lat: 49.2123 },
    ],
  },
  {
    name: '广西',
    cities: [
      { id: 'cn-gx-nanning', name: '南宁', nameEn: 'Nanning', lng: 108.3669, lat: 22.817 },
      { id: 'cn-gx-guilin', name: '桂林', nameEn: 'Guilin', lng: 110.2902, lat: 25.2744 },
      { id: 'cn-gx-yangshuo', name: '阳朔', nameEn: 'Yangshuo', lng: 110.4895, lat: 24.7783 },
    ],
  },
  {
    name: '西藏',
    cities: [
      { id: 'cn-xz-lhasa', name: '拉萨', nameEn: 'Lhasa', lng: 91.1322, lat: 29.6604 },
      { id: 'cn-xz-nyingchi', name: '林芝', nameEn: 'Nyingchi', lng: 94.3623, lat: 29.6488 },
    ],
  },
  {
    name: '宁夏',
    cities: [
      { id: 'cn-nx-yinchuan', name: '银川', nameEn: 'Yinchuan', lng: 106.2309, lat: 38.4872 },
      { id: 'cn-nx-zhongwei', name: '中卫', nameEn: 'Zhongwei', lng: 105.1966, lat: 37.4998 },
    ],
  },
  {
    name: '新疆',
    cities: [
      { id: 'cn-xj-urumqi', name: '乌鲁木齐', nameEn: 'Urumqi', lng: 87.6168, lat: 43.8256 },
      { id: 'cn-xj-kashgar', name: '喀什', nameEn: 'Kashgar', lng: 75.9893, lat: 39.4642 },
      { id: 'cn-xj-kanas', name: '喀纳斯', nameEn: 'Kanas', lng: 87.0176, lat: 48.7889 },
    ],
  },
  {
    name: '香港',
    cities: [
      { id: 'cn-hk-hongkong', name: '香港', nameEn: 'Hong Kong', lng: 114.1694, lat: 22.3193 },
    ],
  },
  {
    name: '澳门',
    cities: [
      { id: 'cn-mo-macau', name: '澳门', nameEn: 'Macau', lng: 113.5439, lat: 22.1987 },
    ],
  },
];

// Build full China city list with country fields
export const CHINA_CITIES: City[] = CHINA_PROVINCES.flatMap((p) =>
  p.cities.map((c) => ({
    ...c,
    country: '中国',
    countryCode: 'CN',
    province: p.name,
    isChina: true,
  }))
);

// ============================================================
// World cities
// ============================================================
const WORLD_CITY_DEFS: Omit<City, 'isChina'>[] = [
  { id: 'jp-tokyo', name: '东京', nameEn: 'Tokyo', country: '日本', countryCode: 'JP', province: '关东', lng: 139.6917, lat: 35.6895 },
  { id: 'jp-osaka', name: '大阪', nameEn: 'Osaka', country: '日本', countryCode: 'JP', province: '关西', lng: 135.5023, lat: 34.6937 },
  { id: 'jp-kyoto', name: '京都', nameEn: 'Kyoto', country: '日本', countryCode: 'JP', province: '关西', lng: 135.7681, lat: 35.0116 },
  { id: 'jp-sapporo', name: '札幌', nameEn: 'Sapporo', country: '日本', countryCode: 'JP', province: '北海道', lng: 141.3545, lat: 43.0618 },
  { id: 'kr-seoul', name: '首尔', nameEn: 'Seoul', country: '韩国', countryCode: 'KR', province: '首尔', lng: 126.978, lat: 37.5665 },
  { id: 'kr-busan', name: '釜山', nameEn: 'Busan', country: '韩国', countryCode: 'KR', province: '庆尚', lng: 129.0756, lat: 35.1796 },
  { id: 'sg-singapore', name: '新加坡', nameEn: 'Singapore', country: '新加坡', countryCode: 'SG', province: '新加坡', lng: 103.8198, lat: 1.3521 },
  { id: 'th-bangkok', name: '曼谷', nameEn: 'Bangkok', country: '泰国', countryCode: 'TH', province: '曼谷', lng: 100.5018, lat: 13.7563 },
  { id: 'th-chiangmai', name: '清迈', nameEn: 'Chiang Mai', country: '泰国', countryCode: 'TH', province: '清迈', lng: 98.9853, lat: 18.7883 },
  { id: 'my-kualalumpur', name: '吉隆坡', nameEn: 'Kuala Lumpur', country: '马来西亚', countryCode: 'MY', province: '吉隆坡', lng: 101.6869, lat: 3.139 },
  { id: 'vn-hanoi', name: '河内', nameEn: 'Hanoi', country: '越南', countryCode: 'VN', province: '河内', lng: 105.8342, lat: 21.0278 },
  { id: 'vn-saigon', name: '胡志明市', nameEn: 'Ho Chi Minh City', country: '越南', countryCode: 'VN', province: '东南', lng: 106.6297, lat: 10.8231 },
  { id: 'kh-siemreap', name: '暹粒', nameEn: 'Siem Reap', country: '柬埔寨', countryCode: 'KH', province: '暹粒', lng: 103.8591, lat: 13.3671 },
  { id: 'id-bali', name: '巴厘岛', nameEn: 'Bali', country: '印度尼西亚', countryCode: 'ID', province: '巴厘', lng: 115.1889, lat: -8.4095 },
  { id: 'in-delhi', name: '新德里', nameEn: 'New Delhi', country: '印度', countryCode: 'IN', province: '德里', lng: 77.1025, lat: 28.7041 },
  { id: 'in-mumbai', name: '孟买', nameEn: 'Mumbai', country: '印度', countryCode: 'IN', province: '马哈拉施特拉', lng: 72.8777, lat: 19.076 },
  { id: 'ae-dubai', name: '迪拜', nameEn: 'Dubai', country: '阿联酋', countryCode: 'AE', province: '迪拜', lng: 55.2708, lat: 25.2048 },
  { id: 'tr-istanbul', name: '伊斯坦布尔', nameEn: 'Istanbul', country: '土耳其', countryCode: 'TR', province: '伊斯坦布尔', lng: 28.9784, lat: 41.0082 },
  { id: 'tr-cappadocia', name: '卡帕多奇亚', nameEn: 'Cappadocia', country: '土耳其', countryCode: 'TR', province: '内夫谢希尔', lng: 34.8313, lat: 38.6431 },
  { id: 'gb-london', name: '伦敦', nameEn: 'London', country: '英国', countryCode: 'GB', province: '英格兰', lng: -0.1276, lat: 51.5074 },
  { id: 'gb-edinburgh', name: '爱丁堡', nameEn: 'Edinburgh', country: '英国', countryCode: 'GB', province: '苏格兰', lng: -3.1883, lat: 55.9533 },
  { id: 'fr-paris', name: '巴黎', nameEn: 'Paris', country: '法国', countryCode: 'FR', province: '法兰西岛', lng: 2.3522, lat: 48.8566 },
  { id: 'fr-nice', name: '尼斯', nameEn: 'Nice', country: '法国', countryCode: 'FR', province: '普罗旺斯', lng: 7.262, lat: 43.7102 },
  { id: 'it-rome', name: '罗马', nameEn: 'Rome', country: '意大利', countryCode: 'IT', province: '拉齐奥', lng: 12.4964, lat: 41.9028 },
  { id: 'it-venice', name: '威尼斯', nameEn: 'Venice', country: '意大利', countryCode: 'IT', province: '威尼托', lng: 12.3155, lat: 45.4408 },
  { id: 'it-florence', name: '佛罗伦萨', nameEn: 'Florence', country: '意大利', countryCode: 'IT', province: '托斯卡纳', lng: 11.2558, lat: 43.7696 },
  { id: 'es-barcelona', name: '巴塞罗那', nameEn: 'Barcelona', country: '西班牙', countryCode: 'ES', province: '加泰罗尼亚', lng: 2.1734, lat: 41.3851 },
  { id: 'es-madrid', name: '马德里', nameEn: 'Madrid', country: '西班牙', countryCode: 'ES', province: '马德里', lng: -3.7038, lat: 40.4168 },
  { id: 'pt-lisbon', name: '里斯本', nameEn: 'Lisbon', country: '葡萄牙', countryCode: 'PT', province: '里斯本', lng: -9.1393, lat: 38.7223 },
  { id: 'gr-athens', name: '雅典', nameEn: 'Athens', country: '希腊', countryCode: 'GR', province: '阿提卡', lng: 23.7275, lat: 37.9838 },
  { id: 'gr-santorini', name: '圣托里尼', nameEn: 'Santorini', country: '希腊', countryCode: 'GR', province: '南爱琴', lng: 25.4615, lat: 36.3932 },
  { id: 'de-berlin', name: '柏林', nameEn: 'Berlin', country: '德国', countryCode: 'DE', province: '柏林', lng: 13.405, lat: 52.52 },
  { id: 'de-munich', name: '慕尼黑', nameEn: 'Munich', country: '德国', countryCode: 'DE', province: '巴伐利亚', lng: 11.582, lat: 48.1351 },
  { id: 'nl-amsterdam', name: '阿姆斯特丹', nameEn: 'Amsterdam', country: '荷兰', countryCode: 'NL', province: '北荷兰', lng: 4.9041, lat: 52.3676 },
  { id: 'ch-zurich', name: '苏黎世', nameEn: 'Zurich', country: '瑞士', countryCode: 'CH', province: '苏黎世', lng: 8.5417, lat: 47.3769 },
  { id: 'at-vienna', name: '维也纳', nameEn: 'Vienna', country: '奥地利', countryCode: 'AT', province: '维也纳', lng: 16.3738, lat: 48.2082 },
  { id: 'cz-prague', name: '布拉格', nameEn: 'Prague', country: '捷克', countryCode: 'CZ', province: '布拉格', lng: 14.4378, lat: 50.0755 },
  { id: 'ru-moscow', name: '莫斯科', nameEn: 'Moscow', country: '俄罗斯', countryCode: 'RU', province: '莫斯科', lng: 37.6173, lat: 55.7558 },
  { id: 'se-stockholm', name: '斯德哥尔摩', nameEn: 'Stockholm', country: '瑞典', countryCode: 'SE', province: '斯德哥尔摩', lng: 18.0686, lat: 59.3293 },
  { id: 'no-oslo', name: '奥斯陆', nameEn: 'Oslo', country: '挪威', countryCode: 'NO', province: '奥斯陆', lng: 10.7522, lat: 59.9139 },
  { id: 'is-reykjavik', name: '雷克雅未克', nameEn: 'Reykjavik', country: '冰岛', countryCode: 'IS', province: '首都区', lng: -21.9426, lat: 64.1466 },
  { id: 'us-newyork', name: '纽约', nameEn: 'New York', country: '美国', countryCode: 'US', province: '纽约州', lng: -74.006, lat: 40.7128 },
  { id: 'us-losangeles', name: '洛杉矶', nameEn: 'Los Angeles', country: '美国', countryCode: 'US', province: '加州', lng: -118.2437, lat: 34.0522 },
  { id: 'us-sanfrancisco', name: '旧金山', nameEn: 'San Francisco', country: '美国', countryCode: 'US', province: '加州', lng: -122.4194, lat: 37.7749 },
  { id: 'us-hawaii', name: '夏威夷', nameEn: 'Honolulu', country: '美国', countryCode: 'US', province: '夏威夷州', lng: -157.8583, lat: 21.3069 },
  { id: 'us-lasvegas', name: '拉斯维加斯', nameEn: 'Las Vegas', country: '美国', countryCode: 'US', province: '内华达', lng: -115.1398, lat: 36.1699 },
  { id: 'ca-toronto', name: '多伦多', nameEn: 'Toronto', country: '加拿大', countryCode: 'CA', province: '安大略', lng: -79.3832, lat: 43.6532 },
  { id: 'ca-vancouver', name: '温哥华', nameEn: 'Vancouver', country: '加拿大', countryCode: 'CA', province: 'BC', lng: -123.1207, lat: 49.2827 },
  { id: 'mx-cancun', name: '坎昆', nameEn: 'Cancun', country: '墨西哥', countryCode: 'MX', province: '金塔纳罗奥', lng: -86.8515, lat: 21.1619 },
  { id: 'br-rio', name: '里约热内卢', nameEn: 'Rio de Janeiro', country: '巴西', countryCode: 'BR', province: '里约', lng: -43.1729, lat: -22.9068 },
  { id: 'ar-buenosaires', name: '布宜诺斯艾利斯', nameEn: 'Buenos Aires', country: '阿根廷', countryCode: 'AR', province: '布宜诺斯艾利斯', lng: -58.3816, lat: -34.6037 },
  { id: 'au-sydney', name: '悉尼', nameEn: 'Sydney', country: '澳大利亚', countryCode: 'AU', province: '新南威尔士', lng: 151.2093, lat: -33.8688 },
  { id: 'au-melbourne', name: '墨尔本', nameEn: 'Melbourne', country: '澳大利亚', countryCode: 'AU', province: '维多利亚', lng: 144.9631, lat: -37.8136 },
  { id: 'nz-auckland', name: '奥克兰', nameEn: 'Auckland', country: '新西兰', countryCode: 'NZ', province: '奥克兰', lng: 174.7633, lat: -36.8485 },
  { id: 'eg-cairo', name: '开罗', nameEn: 'Cairo', country: '埃及', countryCode: 'EG', province: '开罗', lng: 31.2357, lat: 30.0444 },
  { id: 'za-capetown', name: '开普敦', nameEn: 'Cape Town', country: '南非', countryCode: 'ZA', province: '西开普', lng: 18.4241, lat: -33.9249 },
  { id: 'ma-marrakech', name: '马拉喀什', nameEn: 'Marrakech', country: '摩洛哥', countryCode: 'MA', province: '马拉喀什', lng: -7.9891, lat: 31.6295 },
  { id: 'ke-nairobi', name: '内罗毕', nameEn: 'Nairobi', country: '肯尼亚', countryCode: 'KE', province: '内罗毕', lng: 36.8219, lat: -1.2921 },
  { id: 'au-cairns', name: '凯恩斯', nameEn: 'Cairns', country: '澳大利亚', countryCode: 'AU', province: '昆士兰', lng: 145.771, lat: -16.9186 },
];

export const WORLD_CITIES: City[] = WORLD_CITY_DEFS.map((c) => ({ ...c, isChina: false }));

export const ALL_CITIES: City[] = [...CHINA_CITIES, ...WORLD_CITIES];

export const ALL_COUNTRIES: string[] = Array.from(new Set(ALL_CITIES.map((c) => c.country)));

/** Lookup city by id */
export const cityMap: Record<string, City> = Object.fromEntries(
  ALL_CITIES.map((c) => [c.id, c])
);

/** Find city by Chinese or English name (fuzzy) */
export function findCityByName(query: string): City | undefined {
  const q = query.trim().toLowerCase();
  return ALL_CITIES.find(
    (c) => c.name === query || c.nameEn.toLowerCase() === q || c.nameEn.toLowerCase().includes(q)
  );
}

/** List of all China province names */
export const CHINA_PROVINCE_NAMES: string[] = CHINA_PROVINCES.map((p) => p.name);
