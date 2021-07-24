import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Web3Service } from './service/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'AngularCharitydapp';
  accountNumber: any;
  orgName: any;
  orgcoinswanted: any;
  show = true;
  totalProduct = [];
  private charitychain: any;
  balance: any;
  constructor(private web3: Web3Service, private cd: ChangeDetectorRef) {

    this.web3.checkAndInstantiateWeb3()
      .then((checkConn: any) => {
        if (checkConn === 'connected') {
          this.web3.loadBlockChainData()
            .then((accountData: any) => {
              this.accountNumber = accountData[0];
              this.web3.getEtherBalance(this.accountNumber)
                .then((data: any) => {
                  this.balance = Number(data).toFixed(2);
                  console.log(data);
                });
              this.web3.getContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.charitychain = contractRes;
                    this.charitychain.methods.orgsCount()
                      .call()
                      .then(value => {
                        for (let i = 1; i <= value; i++) {
                          const product = this.charitychain.methods.organisations(i)
                            .call()
                            .then(organisations => {
                              this.show = false;
                              this.totalProduct.push(organisations);
                              this.cd.detectChanges();
                            });
                        }
                        console.log('totalProduct ', this.totalProduct);
                      });
                  }
                });
            }, err => {
              console.log('account error', err);
            });
        }
      }, err => {
        alert(err);
      });
  }

  ngOnInit() {
  }


  private createProducts(name, coins_wanted) {
    this.show = true;
    console.log(name, coins_wanted);
    const etherPrice = this.web3.convertPriceToEther(coins_wanted);
    this.charitychain.methods.createOrganisation(name, etherPrice)
      .send({ from: this.accountNumber })
      .once('receipt', (receipt) => {
        this.totalProduct.push(receipt.events.ProductCreated.returnValues);
        this.show = false;
      });
  }


  private purchaseProducts(id, coins_wanted) {
    this.show = true;
    this.charitychain.methods.giveDonation(id)
      .send({ from: this.accountNumber, value: coins_wanted })
      .once('receipt', (receipt) => {
        console.log('receipt ', receipt);
        // this.totalProduct.push(receipt.events.ProductCreated.returnValues);
        this.show = false;
      })
      .on('error', (error) => {
        console.log('receipt ', error);
        this.show = false;
      });

  }

  private convertEtherToPrice(coins_wanted) {
    return this.web3.convertEtherToPrice(coins_wanted);
  }


  trackByFn(index, item) {
    return item.reqSatisfied;
  }
}
