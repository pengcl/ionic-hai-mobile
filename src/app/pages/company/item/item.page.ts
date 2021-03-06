import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, ActivatedRoute} from '@angular/router';
import {StorageService} from '../../../@core/utils/storage.service';
import {TabsService} from '../../../tabs/tabs.service';
import {ToastService} from '../../../@core/modules/toast';
import {DialogService} from '../../../@core/modules/dialog';
import {AuthService} from '../../auth/auth.service';
import {CompanyService} from '../company.service';


@Component({
  selector: 'app-company-item',
  templateUrl: 'item.page.html',
  styleUrls: ['item.page.scss']
})
export class CompanyItemPage {
  token = this.authSvc.token();
  id = this.route.snapshot.params.id;
  data;

  constructor(private title: Title,
              private route: ActivatedRoute,
              private router: Router,
              private storageSvc: StorageService,
              private tabsSvc: TabsService,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private companySvc: CompanyService) {
  }

  ionViewDidEnter() {
    this.title.setTitle('企业详情');
    this.tabsSvc.set(false);
    this.storageSvc.set('companyId', this.id);
    this.companySvc.get(this.token.key, this.id).subscribe(res => {
      this.data = res;
      console.log(this.data);
    });
  }

  onCall(mobile) {
    window.location.href = 'tel:' + mobile;
  }

  delete() {
    this.dialogSvc.show({content: '是否确认删除【' + this.data.busCust.companyName + '】企业信息？', cancel: '取消', confirm: '确认删除'}).subscribe(state => {
      if (state.value) {
        this.toastSvc.show('删除中...', 0);
        this.companySvc.delete(this.token.key, this.id).subscribe(res => {
          this.toastSvc.hide();
          this.router.navigate(['/pages/company/list']);
        });
      }
    });
  }

}
