# Surge Bandwagon/机场信息面板



## 1. 编辑Surge配置文件，查找 `[Panel]` 部分(没有需要手动增加)，按需添加信息面板配置内容：
   
   ```
[Panel]
SUB-info = script-name=SUB,update-interval=7200
VPS-info = script-name=VPS,update-interval=7200
   ```
   - `SUB-info` 为机场信息面板
   - `VPS-info` 为Bandwagon信息面板
   
   
## 2. 继续查找 `[Script]` 部分(没有需要手动增加），按需添加脚本配置项：
   
   ```
[Script]
SUB = type=generic,timeout=5,script-path=https://raw.githubusercontent.com/412999826/surge-panel/refs/heads/main/SUB-info.js,script-update-interval=86400,argument=url=xxxx&title=Sub&reset_day=xxxx&icon=network.badge.shield.half.filled&color=#ebc142
VPS = type=generic,timeout=5,script-path=https://raw.githubusercontent.com/412999826/surge-panel/refs/heads/main/VPS-info.js,script-update-interval=86400,argument=veid=xxxx&apikey=private_xxxxx&title=Bandwagon&icon=network.badge.shield.half.filled&color=#ebc142
   ```
   - `SUB` `Bandwagon`为要添加的脚本名称，必须与上面要运行的脚本名称必须保持一致
   - `script-path` 和 `type` 的值不建议修改，除非你知道你在做什么
   - `script-update-interval` 脚本自动更新频率，单位为秒，建议保持默认，更新频率太频繁会影响续航
   - `timeout` 脚本的最长运行时间
   - `argument` 后面为传入脚本的参数，通过&将多个参数进行分割
      - `title` 必填，面板展示标题
      - `icon` 选填，可自定义图标，字段内容为有效的SF Symbol Name（删除该参数后将调用脚本默认的icon）
      - `color` 选填，可自定义图标颜色，字段内容为颜色的 HEX 编码（删除该参数后将调用脚本默认的color）
      - `url` 机场信息面板必填参数，将订阅链接[encode](https://www.urlencoder.org)后填入
      - `reset_day` 选填，填写流量重置日期，自动计算流量还有多久重置
      - `veid` Bandwagon面板必填参数，通过 Bandwagon KiwiVM 的 API获取后填入
      - `apikey`Bandwagon面板必填参数，通过 Bandwagon KiwiVM 的 API获取后填入

            

## 3. 保存Surge配置文件



## 4. Surge打开信息面板，点击刷新按钮查看运行效果
![Panel](https://raw.github.com/412999826/surge-panel/refs/heads/main/CleasnShot.jpg)

