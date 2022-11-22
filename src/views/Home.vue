<template>
  <van-notice-bar
    left-icon="volume-o"
    text="无论我们能活多久，我们能够享受的只有无法分割的此刻，此外别无其他。"
    background="#75c472"
    color="#ffffff"
  />
  <div class="home">
    <van-row justify="center" v-if="modelShow" class="content">
      <van-col span="24" class="col1">
        <van-radio-group v-model="model">
          <van-cell-group inset>
            <van-cell title="练习模式" clickable @click="model = '1'">
              <template #right-icon>
                <van-radio name="1" />
              </template>
            </van-cell>
            <van-cell title="测试模式" clickable @click="model = '2'">
              <template #right-icon>
                <van-radio name="2" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <van-button
          round
          block
          @click="getTopic()"
          type="primary"
          native-type="submit"
          color="#75c472"
        >
          开始
        </van-button>
      </van-col>
    </van-row>
    <van-row justify="center" v-else class="content">
      <van-col span="24" class="col1">
        <van-form class="form" @submit="submit">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-row
              justify="left"
              v-if="lists.length > 0"
              v-for="(item, i) in lists"
              :key="i"
              class="row"
            >
              <van-col span="24" style="font-size: 14px">
                <b>{{ i + 1 }}.{{ item.title }}</b>
                <span style="color: red; font-weight: 800">{{
                  item.type
                }}</span>
                <br />
                <van-radio-group
                  v-if="item.type === '单选' || item.type === '判断'"
                  v-model="item.result"
                  :disabled="item.result.length > 0"
                >
                  <van-radio
                    class="vanRadio"
                    style="line-height: 50px"
                    :name="items[0]"
                    v-for="(items, index) in item.item"
                    :key="index"
                    clickable
                    @click="checked = items[0]"
                  >
                    {{ items }}
                    <view v-if="item.result.length > 0">
                      <view
                        v-if="item.answer[0] == items[0]"
                        style="color: #31922d"
                      >
                        <b>正确</b>
                      </view>
                      <view v-else style="color: red"> 错误 </view>
                    </view>
                  </van-radio>
                </van-radio-group>
                <van-checkbox-group
                  v-if="item.type === '多选'"
                  v-model="item.result"
                  :disabled="item.isShow"
                >
                  <van-checkbox
                    class="vanCheckbox"
                    style="line-height: 50px"
                    v-for="(items, index) in item.item"
                    :key="index"
                    :name="items[0]"
                    shape="square"
                    >{{ items }}
                    <view v-if="item.isShow">
                      <view
                        v-if="item.answer.includes(items[0])"
                        style="color: #31922d"
                      >
                        <b>正确</b>
                      </view>
                      <view v-else style="color: red">错误 </view>
                    </view>
                    <view> </view>
                  </van-checkbox>
                  <van-button
                    style="
                      background-color: #75c473;
                      color: #fff;
                      border-color: #75c473;
                      margin: 0 auto;
                      display: flex;
                    "
                    v-if="item.result.length > 0 && !item.isShow"
                    @click="checkboxBtn(i)"
                    >选好了</van-button
                  >
                </van-checkbox-group>
              </van-col>
            </van-row>
            <van-button
              style="
                background-color: #75c473;
                color: #fff;
                border-color: #75c473;
                margin: 0 auto;
                display: flex;
              "
              v-if="finished && model == '2' && !isSubmit"
              @click="submit()"
              >做完啦</van-button
            >
          </van-list>
        </van-form>
      </van-col>
    </van-row>
  </div>
  <van-dialog id="van-dialog" />
</template>

<script>
import { ref } from "vue";
import { getTopicApi } from "@/api/index";
import { Notify, Dialog } from "vant";
import "vant/es/toast/style";
export default {
  setup() {
    const list = ref([]); //愿数据
    const lists = ref([]); //页面数据
    var modelShow = ref(true);
    const finished = ref(false);
    var loading = ref(false);
    //答题模式，测试、练习
    var model = ref("1");
    //懒加载数据的当前下标
    var currentIndex = 0;
    //多选题的按钮是否显示
    var isShow = ref(false);
    //数据的长度，默认是测试模式数据的长度
    var dataLen = 397;
    //答题分数
    var score = ref(0);
    //测试模式下是否已经提交
    var isSubmit = ref(false);
    //生成指定范围的随机数组，0到最大范围
    function getRandomNumber(n, max) {
      let randomList = [];
      while (randomList.length < n) {
        let num = Math.floor(Math.random() * max);
        if (randomList.indexOf(num) == -1) {
          randomList.push(num);
        }
      }
      return randomList;
    }
    //调用产生随机数的方法
    var random = getRandomNumber(100, 397);
    //获取题库数据
    const getTopic = async (values) => {
      loading.value = true;
      var res = await getTopicApi(1);
      if (res.length != 0) {
        //如果选择的是练习模式，那么需要随机选择100道题
        if (model.value == "2") {
          dataLen = 100;
          for (let i = 0; i < random.length; i++) {
            list.value.push(res[random[i]]);
          }
        } else {
          //测试模式直接copy全部数据
          list.value = res;
        }
        Notify({ type: "success", message: "获取题库成功" });
        //关闭数据加载动画
        loading.value = false;
        //关闭模式选择对话框
        modelShow.value = false;
        return;
      }
    };
    // 异步更新数据
    const onLoad = () => {
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        //每次取20条数据
        var len = 20;
        //如果选择的是练习模式，那么需要判断一下，因为数据长度是397，每页20条，到最后一页我们只取17条数据
        if (model.value == "1") {
          if (currentIndex >= 380) {
            len = 17;
          }
        }
        //为了达到懒加载效果，我们每次从原数据中取20条数据放入页面中
        for (let i = 0; i < len; i++) {
          lists.value.push(list.value[currentIndex]);
          currentIndex++;
        }
        // 加载状态结束
        loading.value = false;
        // 数据全部加载完成，关闭懒加载触发
        if (lists.value.length >= dataLen) {
          finished.value = true;
        }
      }, 1000);
    };
    //测试模式下提交并计算分数，单选、判断、多选（所有结果均成立），分值：1
    const submit = () => {
      //遍历所有数据
      for (let i = 0; i < lists.value.length; i++) {
        //为了计算多选题，如果有一个项不成立那么分值不做累加
        var flag = false;
        //判断用户选择的项与答案项长度是否匹配，如果不匹配那么就是不正确
        go: if (lists.value[i].result.length == lists.value[i].answer.length) {
          //判断是否是单选和多选
          if (lists.value[i].type == "单选" || lists.value[i].type == "判断") {
            //如果答案中的项在用户选择的项中存在那么分值直接++并结束本次item
            if (lists.value[i].answer.includes(lists.value[i].result[0])) {
              flag = true;
              break go;
            }
          } else {
            //多选题需要遍历
            for (let j = 0; j < lists.value[i].result.length; j++) {
              //如果用户选择的项与答案项匹配则为正确答案，然后继续判断用户下一个选择的
              if (lists.value[i].result[j] == lists.value[i].answer[j]) {
                flag = true;
              } else {
                //如果用户选择的有一个不满足，直接不累加分值，并跳出循环
                flag = false;
                break go;
              }
            }
          }
        }
        if (flag) {
          score.value += 1;
        }
      }
      var dialogMsg = "";
      if (score.value < 60) {
        dialogMsg = "啊哦，很遗憾您的本次答题未能及格\n再加把劲叭\n";
      } else if (score.value >= 60 && score.value <= 70) {
        dialogMsg = "本次答题刚满及格，继续努力叭\n";
      } else if (score.value >= 70 && score.value <= 80) {
        dialogMsg = "本次答题良好，继续努力叭，再加把劲就到优秀成绩啦\n";
      } else {
        dialogMsg = "恭喜你，本次答题获得优秀成绩，但是也不要松懈哦\n";
      }
      Dialog.alert({
        message: dialogMsg + "得分:" + score.value,
      });
      isSubmit.value = true;
    };
    //多选题的确认按钮
    const checkboxBtn = (index) => {
      lists.value[index].isShow = !lists.value[index].isShow;
    };

    return {
      model,
      list,
      modelShow,
      getTopic,
      loading,
      lists,
      finished,
      onLoad,
      isShow,
      checkboxBtn,
      score,
      submit,
      isSubmit,
    };
  },
};
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.home {
  padding-top: 80px;
  width: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  .content {
    background-color: #fff;
    width: 90%;
    margin: 0 auto;
    border-radius: 10px;
    .col1 {
      padding: 20px;
      line-height: 20px;
      text-align: left;
      .col1-border {
        padding: 10px;
        color: #0f5132;
        background-color: #d1e7dd;
        border-color: #badbcc;
        border-radius: 10px;
      }
      .vanRadio,
      .vanCheckbox {
        margin-top: 35px;
        margin-bottom: 35px;
      }
    }
  }
}
.row {
  margin-bottom: 20px;
}
.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: #76c572;
  border-radius: 100px;
}
</style>