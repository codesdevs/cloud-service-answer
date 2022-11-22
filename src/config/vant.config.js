import { Button, List, Cell, CellGroup, Form, Field, NoticeBar, Col, Row, Loading, Notify, Slider, RadioGroup, Radio, Image as VanImage, Lazyload, Pagination, Checkbox, CheckboxGroup,Toast } from 'vant';

export function vant(app) {
  app.use(Button);
  app.use(List)
  app.use(Cell);
  app.use(CellGroup);
  app.use(Form)
  app.use(Field)
  app.use(NoticeBar)
  app.use(Col)
  app.use(Row)
  app.use(Loading)
  app.use(Notify)
  app.use(Slider)
  app.use(RadioGroup)
  app.use(Radio)
  app.use(VanImage)
  app.use(Lazyload)
  app.use(Pagination)
  app.use(Checkbox)
  app.use(CheckboxGroup)
  app.use(Toast)
}
export default {
  components: {
    [Notify.Component.name]: Notify.Component,
  },
};