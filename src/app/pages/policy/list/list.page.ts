import {Component, ViewChild, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {IonInfiniteScroll, ModalController} from '@ionic/angular';
import {TabsService} from '../../../tabs/tabs.service';
import {AuthService} from '../../auth/auth.service';
import {PolicyService} from '../policy.service';
import {IndustryComponent} from '../../../@theme/components/industry/industry';
import {DATA} from '../../../@core/data/cn';
import {PickerService} from '../../../@core/modules/picker';

@Component({
  selector: 'app-policy-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class PolicyListPage {
  token = this.authSvc.token();
  slideOpts = {
    initialSlide: 1,
    slidesPerView: 4,
    speed: 400
  };

  data;

  province = {
    label: '省份不限',
    name: '',
    value: '',
    sub: []
  };
  city = {
    label: '城市不限',
    name: '',
    value: '',
    sub: []
  };
  area = {
    label: '行政区不限',
    name: '',
    value: '',
    sub: []
  };
  selectedIndustries = [];
  params = {
    key: this.token.key,
    word: '',
    province: '',
    city: '',
    area: '',
    industryIds: [],
    industryNames: [],
    page: 1
  };

  provinces = this.getList(DATA, '省份不限');
  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;

  constructor(private title: Title,
              private modalController: ModalController,
              private tabsSvc: TabsService,
              private pickerSvc: PickerService,
              private authSvc: AuthService,
              private policySvc: PolicyService) {
  }

  ionViewDidEnter() {
    this.title.setTitle('政策列表');
    this.tabsSvc.set(true);
    this.policySvc.list(this.params).subscribe(res => {
      this.data = res.list;
    });
  }

  getList(list, label) {
    const items = [{
      label,
      name: '',
      value: '',
      sub: []
    }];
    list.forEach(item => {
      items.push({
        label: item.name,
        name: item.name,
        value: item.code,
        sub: item.sub
      });
    });
    return items;
  }

  showPicker(type, selectable) {
    if (!selectable) {
      return false;
    }
    let data = this.provinces;
    if (type === 'city') {
      data = this.getList(this.province.sub, '城市不限');
    }
    if (type === 'area') {
      data = this.getList(this.city.sub, '行政区不限');
    }
    this.pickerSvc.show([data]).subscribe(res => {
      this[type] = res.items[0];
      if (type === 'province' && !res.items[0].value) {
        this.city = {
          label: '城市不限',
          name: '',
          value: '',
          sub: []
        };
        this.area = {
          label: '行政区不限',
          name: '',
          value: '',
          sub: []
        };
        this.params.city = '';
        this.params.area = '';
      }
      if (type === 'city' && !res.items[0].value) {
        this.area = {
          label: '行政区不限',
          name: '',
          value: '',
          sub: []
        };
        this.params.area = '';
      }
      this.params[type] = res.items[0].name;
      this.params.page = 1;
      this.infiniteScroll.disabled = false;
      this.getData();
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      showBackdrop: true,
      component: IndustryComponent,
      componentProps: {items: this.selectedIndustries}
    });
    await modal.present();
    const {data} = await modal.onDidDismiss(); // 获取关闭传回的值
    this.selectedIndustries = data;
    this.setIndustries();
  }

  setIndustries() {
    const ids = [];
    this.selectedIndustries.forEach(item => {
      ids.push(item.id);
    });
    this.params.industryIds = ids;
    this.params.page = 1;
    this.infiniteScroll.disabled = false;
    this.getData();
  }

  change(e) {
    this.params.page = 1;
    this.params.word = e.detail.value;
    this.infiniteScroll.disabled = false;
    this.getData();
  }

  getData() {
    this.policySvc.list(this.params).subscribe(res => {
      this.data = res.list;
    });
  }

  loadData(event) {
    setTimeout(() => {
      event.target.complete();
      this.params.page++;
      this.policySvc.list(this.params).subscribe(res => {
        this.data = this.data.concat(res.list);
        if (this.params.page >= res.totalPages) {
          event.target.disabled = true;
        }
      });
    }, 500);
  }
}
