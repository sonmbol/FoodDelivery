const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');

get_branch = (restaurant_id,lat,lon) => new Promise((resolve, reject) => {
     
    mysqlConnection.query('SELECT   *,min(COALESCE(( 6371 * acos( cos( radians(?) ) *  cos( radians( lat ) ) * '
   + 'cos( radians( lon ) - radians(?) ) + sin( radians(?) ) * '
   + 'sin( radians( lat ) ) ) ), 0)) AS distance from  res_branchs where restaurant_id=? and close="0" GROUP by branch_id order by distance  LIMIT 1',[lat,lon,lat,restaurant_id], (err, rows, fields) => {
        if(!err) {
            return resolve(rows[0].branch_id);
        } else {
          console.log(err);
        }
      });
}
  );
//
  get_banquets_by_id = (id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * FROM banquets where restaurant_id=? and hide=0',[id], (err, rows, fields) => {
        if(!err) {
            return res(rows);
          } else {
            console.log(err);
          }
        });
  }
   );

//
   get_restaurant_comm = (restaurant_id,type,res) => new Promise((resolve, reject) => {
    if(type=='1'){
        mysqlConnection.query('SELECT commission as commission FROM restaurants_details where res_id=?',[restaurant_id], (err, rows, fields) => {
            if(!err) {
                return res(rows);
              } else {
                console.log(err);
              }
            });
    }
    else if(type=='2'){
        mysqlConnection.query('SELECT bacomm as commission FROM restaurants_details where res_id=?',[restaurant_id], (err, rows, fields) => {
            if(!err) {
                return res(rows);
              } else {
                console.log(err);
              }
            });
    }
    else if(type=='3'){
        mysqlConnection.query('SELECT bocomm as commission FROM restaurants_details where res_id=?',[restaurant_id], (err, rows, fields) => {
            if(!err) {
                return res(rows);
              } else {
                console.log(err);
              }
            });
    }
    else if(type=='4'){
        mysqlConnection.query('SELECT bucomm as commission FROM restaurants_details where res_id=?',[restaurant_id], (err, rows, fields) => {
            if(!err) {
                //return res(rows);
                console.log(rows);
              } else {
                console.log(err);
              }
            });
    }
   }
);

//
add_booking = (name,phone,user_id,res_id,branch_id,date,time,num,comm,ress) => new Promise((resolve, reject) => {
    mysqlConnection.query('insert into booking (name,phone,uid,res_id,branch_id,date,time,num,comm) values (?,?,?,?,?,?,?,?,?) ', [name,phone,user_id,res_id,branch_id,date,time,num,comm], (err,records) => {
        if(!err) {
            var id = JSON.parse(records.insertId);
            if (mysqlConnection){
            var book_id = {"book_id" : id,"success" : true};
            }
            else{
                var book_id = {"book_id" : id,"success" : false};  
            }
           ress(book_id)
        //     get_add_booking(id,function (response){
        //    ress(response);
        //     });
            
            // return res(id+rows[0].success);
             //return res("success");
          } else {
            console.log(records);
          }
        });

}
);
//
  get_reviews  = (id,offset,res) => new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT users.name as name,users.img as img,reviews.content as content,SUBSTR(reviews.date,1,10) as date,'
        +'TRUNCATE(((reviews.price_rating+reviews.food_rating+reviews.services_rating)/3), 2) AS rate  FROM reviews '
        +'INNER JOIN users  ON reviews.u_id = users.uid where reviews.resturant_id = ? and reviews.hide=0  order by reviews.id desc LIMIT 10  OFFSET ? ',[id,offset], (err, rows, fields) => {
        if(!err) {
          res(rows);
        } else {
          console.log(err);
        }
      });
}
 );

//

 get_user_booking  = (user_id,book_id,res) => new Promise((resolve, reject) => {
    if (book_id == "0") {
        mysqlConnection.query('SELECT  b.id as id ,b.name as name ,b.phone as phone,b.gift as gift ,b.date as date,b.time time,b.num num ,b.status status,b.uconfirm confirm,b.total total,b.utotal utotal,r.name as en_res,r.cover as cover,r.ar_name as ar_res  FROM booking b, restaurants r where  b.res_id = r.restaurant_id and b.uid=? order by (b.id) desc',[user_id], (err, rows, fields) => {
             if(!err) {
            //   res.json({"booking" : rows });
              return res(rows);
            } else {
              console.log(err);
            }
          });  
    } else {
        mysqlConnection.query('SELECT  b.id as id ,b.name as name ,b.phone as phone,b.gift as gift ,b.date as date,b.time time,b.num num ,b.status status,b.uconfirm confirm,b.total total,b.utotal utotal,r.name as en_res,r.cover as cover,r.ar_name as ar_res  FROM booking b, restaurants r where b.id=? and b.res_id = r.restaurant_id and b.uid=? order by (b.id) desc',[book_id,user_id], (err, rows, fields) => {
            if(!err) {
                return res(rows);
            } else {
              console.log(err);
            }
          });
    }
   
}
);
//
get_wallet_transaction = (uid,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('select * from wallettransaction where uid=?',[uid], (err, rows, fields) => {
        if(!err) {
       //   res.json({"booking" : rows });
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
    //
get_ticket = (ticket_id,res) => new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT * from ticket where ticket_id=?',[ticket_id], (err, rows, fields) => {
            if(!err) {
           //   res.json({"booking" : rows });
             return res(rows);
           } else {
             console.log(err);
           }
         });  
        });
        //
get_order_by_ticket = (ticket_id,user_id,res) => new Promise((resolve, reject) => {
            mysqlConnection.query('SELECT orders.price as price,orders.addon as addon,orders.quantity as quantity ,'
            +'orders.ticket_id as ticket_id, menu.name as name,sizes.name as size  FROM orders,menu,sizes  '
            +'where orders.item_id = menu.id and sizes.id = orders.size_id  and orders.ticket_id=? '
            +'and orders.user_id=? and orders.hide="0"',[ticket_id,user_id], (err, rows, fields) => {
                if(!err) {
               //   res.json({"booking" : rows });
                 return res(rows);
               } else {
                 console.log(err);
               }
             });  
            });
//
get_all_address = (user_id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * from address where uid=? and hide=0 order by (isdefault) desc ',[user_id], (err, rows, fields) => {
        if(!err) {
       //   res.json({"booking" : rows });
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
    get_user_bar  = (user_id,res) => new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT  count(*) as orders ,IFNULL(sum(ticket.total), 0)+IFNULL(sum(ticket.delivery), 0)+IFNULL(sum(ticket.vat), 0) as total ,'
        +'IFNULL(sum(ticket.delivery), 0) as delivery  FROM users,ticket, orders'
        +' where  users.uid=? and orders.ticket_id = ticket.ticket_id and orders.status=1 and orders.user_id=? and orders.hide=0  '
        ,[user_id,user_id], (err, rows, fields) => {
            if(!err) {
           //   res.json({"booking" : rows });
             return res(rows);
           } else {
             console.log(err);
           }
         });  
        });
//
get_profile  = (user_id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * from users where uid=?',[user_id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_resturant_details_by_id  = (id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * FROM restaurants_details where res_id=?',[id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_offers_by_res  = (res_id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT  * FROM offers where status=1 and (restaurant_id=? or restaurant_id="0") order by (restaurant_id) desc LIMIT 1'
    ,[res_id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_user_order  = (user_id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT  ticket.id as id ,ticket.ord_type as type ,ticket.id as id ,ticket.ticket_id as ticket_id ,'
    +'ticket.time as ordertime,ticket.total as total ,ticket.offer_amount as discount , ticket.restaurant_id as restaurant_id,ticket.delivery as delivery,'
    +'ticket.vat as vat  ,ticket.address as address,ticket.status as status ,restaurants.cover as cover,restaurants.name as en_res,'
    +'restaurants.ar_name as ar_res  FROM ticket, restaurants where  ticket.restaurant_id = restaurants.restaurant_id '
    +'and ticket.user_id=? order by (ticket.id) desc;'
    ,[user_id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
add_address = (user_id,address,phone,area,building,appartment,floor,street,lat,lon,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * from address where uid=? and hide=0 and isdefault=1'
    ,[user_id], (err, rows, fields) => {
        if(!err) {
        var isdefault = '0';
         if(rows.length==0){
             isdefault = '1';
         }
         mysqlConnection.query('insert into address (uid,phone,address,area,building,appartment,floor,lat,lon,st,isdefault) values (?,?,?,?,?,?,?,?,?,?,?) ',
          [user_id,phone,address,area,building,appartment,floor,lat,lon,street,isdefault], (err,records) => {
            if(!err) {
                if (mysqlConnection){
                var add_address_success = {"success" : true};
                }
                else{
                    var add_address_success = {"success" : false};  
                }
               res(add_address_success);
              } else {
                console.log(records);
              }
            });    
       } else {
         console.log(err);
       }
     });  
    
}
);
//
confirm_booking_total  = (user_id,book_id,total,utotal,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('select * from booking where id=?' ,[book_id], (err, rows, fields) => {
        if(!err) {
            var prec= JSON.parse(rows[0].prec);
            var discount=(total*prec) / 100;
            mysqlConnection.query('update booking set utotal=?,utotal=?,uconfirm=1,gift=? where id=?' ,[utotal,utotal,discount,book_id], (err, rows, fields) => {
                if(!err) {
                 if(mysqlConnection){
//                var success = {"success" : true};
 //               var discount={"discount" : discount};
                add_wallet_transaction(user_id, discount, 2,function (response){
                    // console.log(response);
                    // res.json({"booking" : response });
                    return res({"success" : response,"discount" : discount});
                    });
               
                 }
                 else{
                    return res({"success" : false});
                 }
                    
               } else {
                 console.log(err);
               }
             });  
       } else {
         console.log(err);
       }
     });  
    });
//
get_wallet_transaction  = (uid,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('select * from wallettransaction where uid=?' ,[uid], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
add_wallet_transaction  = (uid,amount,desc,res) => new Promise((resolve, reject) => {
var date = new Date().getFullYear()+'-'+("0"+(new Date().getMonth()+1)).slice(-2)+'-'+("0"+new Date().getDate()).slice(-2);
    mysqlConnection.query('update  users set balance =balance+? where uid=?' ,[amount,uid], (err, rows, fields) => {
        if(!err) {
            mysqlConnection.query('insert into wallettransaction (date,uid,amount,details) values(?,?,?,?)' ,[date,uid,amount,desc], (err,records) => {
                if(!err) {
                 return res(true);
               } else {
                 console.log(err);
               }
             });  
       } else {
         console.log(err);
       }
     });  
    });
//
get_order_by_size  = (id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT  prices.id as id ,sizes.name as size,sizes.namear as sizear ,prices.price as price,prices.item_size_id as size_id  '
    +', prices.item_id as item_id  FROM  prices,sizes  where  prices.item_id =? and prices.item_size_id = sizes.id and price!=0' ,[id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_addon_group  = (item_id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT group_id,gname,gnamear,max,required from add_on where item_id=? GROUP By (group_id) order by size desc' ,[item_id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_addon = (item_id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT item_group_id,addon_id,addon,addonar,price from add_on where item_id=?' ,[item_id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_categories = (res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT categories.category_id as category_id,categories.category as category,categories.category_ar as category_ar'
    +',categories.img as img,categories.hide as hide,count(restaurants.restaurant_id) as total FROM categories INNER JOIN restaurants ON'
    +' categories.category_id= restaurants.category_id   and categories.hide=0 and restaurants.inapp=1 GROUP BY categories.category_id' , (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_offers = (res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT  offers.restaurant_id restaurant_id,offers.code code,offers.title title,offers.content content,offers.img img'
    +',offers.type type,offers.value value,offers.status  status ,restaurants.ar_name ar_name,restaurants.name name '
    +',((restaurants.price_rating+restaurants.food_rating+restaurants.services_rating)/3) as rate FROM offers,restaurants where offers.status=1 '
    +'  and (offers.restaurant_id=restaurants.restaurant_id) GROUP BY offers.restaurant_id order by (offers.date) desc' , (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
remove_address = (id,user_id,res) => new Promise((resolve, reject) => {
        mysqlConnection.query('update address set hide=1 where id=?' ,[id], (err, rows, fields) => {
            if(!err) {
                return res({"success" :true});
           } else {
             console.log(err);
           }
         });  
        });
    //
default_address = (id,user_id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('update address set isdefault=0 where uid=?' ,[user_id], (err, rows, fields) => {
        if(!err) {
            mysqlConnection.query('update address set isdefault=1 where id=?' ,[id], (err, rows, fields) => {
                if(!err) {
                    return res({"success" :true});
               } else {
                 console.log(err);
               }
             });  
       } else {
         console.log(err);
       }
     });  
    });
//
like = (id,user_id,menu_id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('insert into  likes (restaurant_id,u_id,menu_id) values (?,?,?)' ,[id,user_id,menu_id], (err, rows, fields) => {
        if(!err) {
            mysqlConnection.query('UPDATE menu SET likes = likes + 1  where id=?' ,[menu_id], (err, rows, fields) => {
                if(!err) {
                    return res({"success" :true,"id" : id});
               } else {
                 console.log(err);
               }
             });  
       } else {
         console.log(err);
       }
     });  
    });
//
review =  (id,user_id,foodr,servicesr,pricerate,content,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * from users where uid=? and block="0"' ,[user_id], (err, rows, fields) => {
        if(!err) {
            if(rows.length>0){
            mysqlConnection.query('insert into  reviews (resturant_id,u_id,food_rating,price_rating,services_rating,content) values(?,?,?,?,?,?)' 
            ,[id,user_id,foodr,pricerate,servicesr,content], (err, rows, fields) => {
                if(!err) {
                    mysqlConnection.query('UPDATE restaurants SET reviews = reviews + 1  where restaurant_id=?' 
                    ,[id], (err, rows, fields) => {
                        if(!err) {
                            update_review(id);
                            return res({"success" :true,"id" : id});
                       } else {
                         console.log(err);
                       }
                     }); 
               } else {
                 console.log(err);
               }
             }); } 
       } else {
         console.log(err);
       }
     });  
    });
//
update_review = (id) => new Promise((resolve, reject) => {
    mysqlConnection.query('select avg(food_rating) as food_rating, avg(price_rating) as price_rating'
    +',avg(services_rating) as services_rating from reviews where resturant_id=?' ,[id], (err, rows, fields) => {
        if(!err) {
            if(JSON.parse(rows[0].food_rating)!=0){
           var food_rating = JSON.parse(rows[0].food_rating);
           var price_rating = JSON.parse(rows[0].price_rating);
           var services_rating = JSON.parse(rows[0].services_rating);
            mysqlConnection.query('UPDATE restaurants SET food_rating = ?,price_rating = ?,services_rating = ? where restaurant_id=?' ,[food_rating,price_rating,services_rating,id], (err, rows, fields) => {
                if(!err) {
                    console.log("success");
               } else {
                 console.log(err);
               }
             });  }
       } else {
         console.log(err);
       }
     });  
    });
//
newuser = (uid,name,fire,phone,email,device,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * from users where phone=? or uid=?' ,[phone,uid], (err, rows, fields) => {
        if(!err) {
            if(rows.length>0){
            mysqlConnection.query('update users set name=?,email=?,firebase=?,device=? where phone=?  or uid=?' ,[name,email,fire,device,phone,uid], (err, rows, fields) => {
            }); }
             else{
                mysqlConnection.query('insert into users (uid,name,firebase,phone,email,device) values(?,?,?,?,?,?)' ,[uid,name,fire,phone,email,device], (err, rows, fields) => {
                });
             }
             return res({"success" :true});
       } else {
        return res({"success" :false});
       }
     });  
    });
//
getRestaurantsNearbyResults  = (lat,lon,radius,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT  *,'    
   +' COALESCE(( 6371 * acos( cos( radians(?) ) *  cos( radians( restaurants.lat ) ) * '
   +'cos( radians( restaurants.lon ) - radians(?) ) + sin( radians(?) ) * '
   +'sin( radians( restaurants.lat ) ) ) ), 0) AS distance '
   +'FROM restaurants '
   +'WHERE restaurants.is_deleted = 0  and restaurants.inapp=1 '
   +'HAVING distance <= ? '
   +'ORDER BY distance ASC',[lat,lon,lat,radius], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
check_wallet_trans = (res)  => new Promise((resolve, reject) => {
    var ticket_id = 100;
    mysqlConnection.query('select * from transactions where type="1"', (err, rows, fields) => {
         if(!err) {
          if(rows.length>0){
                ticket_id = rows[rows.length-1].order_id;
                ticket_id = ticket_id.substr(1); 

            
          }
          else{
        ticket_id = 99;
          }
          ticket_id = parseInt(ticket_id)+1;
          ticket_id = 'w'+ticket_id;
          return res(ticket_id);
        } else {
          console.log(err);
        }
      });  
     });
//
add_transction = (tarns_id,avenus_oid,user_id,phone,order_id,type,amount,message,device,date,status,res)  => new Promise((resolve, reject) => {
    mysqlConnection.query('INSERT INTO transactions (tarns_id,avenus_oid,user_id,phone,order_id,type, amount,status_message, device, t_date, status)'
    +' VALUES (?,?,?,?,?,?,?,?,?,?,?)',[tarns_id,avenus_oid,user_id,phone,order_id,type,amount,message,device,date,status], (err, rows, fields) => {
         if(!err) {
            if ((type == 1) && (status == 1)) {
                add_wallet_transaction(user_id,amount,1,function (response){
                    // console.log(response);
                    // res.json({"booking" : response });
                    return res({"success" : response});
                    });
            }else{
            return res({"success" :true});
            }
        } 
        else {
            return res({"success" :false});
        }
      });  
     });
//
get_all_photos = (res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * FROM photos', (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_fslider = (res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT  restaurant_id,name,cover,address,((price_rating+food_rating+services_rating)/3) as rate FROM restaurants'
    +' where slider!=0 or featured!=0 and inapp=1 order by  slider,featured,created_at desc', (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_resturant_by_id = (id,branch_id,user_id,lat,lon,res) => new Promise((resolve, reject) => {
    var date = new Date();
    mysqlConnection.query('UPDATE restaurants SET view = view + 1  where restaurant_id=?',[id], (err, rows, fields) => {
        if(!err) {
            mysqlConnection.query('insert into views (restaurant_id,u_id,date) values (?,?,?)',[id,user_id,date], (err, rows, fields) => {
                if(!err) {
                    mysqlConnection.query('SELECT *,COALESCE(( 6371 * acos( cos( radians(?) ) *  cos( radians( lat ) ) *' 
             +'       cos( radians( lon ) - radians(?) ) + sin( radians(?) ) * '
+'                    sin( radians( lat ) ) ) ), 0) AS distance FROM res_branchs where restaurant_id=? and branch_id=?',[lat,lon,lat,id,branch_id], (err, rows, fields) => {
                        if(!err) {
                         return res(rows);
                       } else {
                         console.log(err);
                       }
                     });  
               } else {
                mysqlConnection.query('UPDATE views SET views = views + 1  where u_id=?',[user_id], (err, rows, fields) => { });  
               }
             });  
       } else {
         console.log(err);
       }
     });  
    });
//
get_photos_by_id  = (id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * FROM photos where restaurant_id=? and hide=0',[id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_menu_by_id = (id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * FROM menu where restaurant_id=? and hide=0 and disable=0 order by (likes) desc',[id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_menu_cat= (id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT menu_cat.id as id,menu_cat.name as name,menu_cat.restaurant_id as restaurant_id,count(menu.menu_cat) as total FROM menu_cat INNER JOIN menu  ON menu_cat.id = menu.menu_cat and menu_cat.restaurant_id=?  and menu_cat.hide=0 and menu.hide=0 GROUP BY menu_cat.id',[id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_videos_by_id = (id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * FROM videos where res_id=? and hide=0 and status=1',[id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_buffet_by_id = (id,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT * FROM buffet where res_id=? and hide=0',[id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
get_menu_likes = (id,uid,res) => new Promise((resolve, reject) => {
  
    var date = {'success' : false };
    mysqlConnection.query('SELECT * FROM menu where restaurant_id=? and hide=0',[id], (err, rows, fields) => {
        if(!err) {
            var counter = 0;
    var array   = [];
    var data    = [];
    var arrayObjs       = [];
    for (var i=0; i<rows.length; i++){
     var   menu_id = rows.id;
     mysqlConnection.query('SELECT * FROM likes where restaurant_id=? and menu_id=? and u_id=?',[id,menu_id,uid], (err, rows, fields) => {
        if(!err) {
        if(rows.length>0){

         likes = {"likes":1};
        }
        else{
            likes =  {"likes":0};
        }
       } else {
         console.log(err);
       }
       arrayObjs.push(likes);
       console.log(arrayObjs);
     });  
    
    }
    return res(arrayObjs);
       } else {
         console.log(err);
       }
     });  
    });
//



get_by_categoray = (cat,lat,lon,res) => new Promise((resolve, reject) => {
    var arrayObjs = [];
    var data      = arrayObjs;
    var counter   = 0;
    if (cat == 0) {
 var sql ='SELECT  restaurant_id,name,ar_name,cover,reviews,view ,((price_rating+food_rating+services_rating)/3) as rate FROM restaurants where inapp=1';
 var parm = []
    }
    else {
        var sql ='SELECT  restaurant_id,name,ar_name,cover,reviews,view ,((price_rating+food_rating+services_rating)/3) as rate FROM restaurants where inapp=1 and category_id=?';
        var parm = [cat]
    }
    mysqlConnection.query(sql,parm, (err, rows, fields) => {
        if(!err) {
            //console.log("1");
            for (var i=0; i<rows.length; i++){
//                  console.log(rows[i].restaurant_id);
                //  console.log(lat+lon);
                get_distance(rows[i].restaurant_id,lat,lon,function (response){
                    if(response!=0){
                     

                      arrayObjs.push(response);
                      console.log(response);
                    counter = counter+1;
//                    console.log(counter);
                    //console.log(arrayObjs);
                    for (var i=0; i<arrayObjs.length; i++){
                        arrayObjs[i] = arrayObjs[i];
                       // console.log( arrayObjs[i]);
                    }
                    //return res(arrayObjs);
                    // console.log(distance);
                     console.log(arrayObjs); 
                    // console.log(arrayObjs.length); 
                     
                    }});
                    //return res(arrayObjs);
                    //if(response!=0){
                        //if (counter < 20) {
                            //console.log(rows.restaurant_id)
                            //  get_distance(rows.restaurant_id,lat,lon,function (response){
                            //     console.log(response);
                            //     //arrayObjs[counter] =response;
                            // });
                           // counter=counter+1;
                      //  }
                //    }
               // });
                   //console.log(counter);
            }
//            console.log("2");
            // for (var i=0; i<arrayObjs.length; i++){
            //     arrayObjs[i] = arrayObjs[i][0];
            //     console.log("2.1");
            // }
// //            console.log("3");
            // var distance = [];
            // for (var key in arrayObjs ) {
            //     key = rows.distance;
            //     distance.push(key);
            // }
            // console.log(arrayObjs);
         
       } else {
         console.log(err);
       }
     });  
    });
//
get_distance = (restaurant_id,lat,lon,res) => new Promise((resolve, reject) => {
    mysqlConnection.query('SELECT   *,rate*reviews as total_reviews ,min(COALESCE(( 6371 * acos( cos( radians(?) ) *  cos( radians( lat ) ) * '
+'    cos( radians( lon ) - radians(?) ) + sin( radians(?) ) * '
  +'  sin( radians( lat ) ) ) ), 0)) AS distance from  res_branchs where restaurant_id=? and close="0" GROUP by branch_id  order by distance  LIMIT 1',[lat,lon,lat,restaurant_id], (err, rows, fields) => {
        if(!err) {
         return res(rows);
       } else {
         console.log(err);
       }
     });  
    });
//
module.exports = {
    get_branch,
    get_reviews,
    get_user_booking,
    get_banquets_by_id,
    get_restaurant_comm,
    add_booking,
    get_ticket,
    get_order_by_ticket,
    get_all_address,
    get_user_bar,
    get_profile,
    get_resturant_details_by_id,
    get_offers_by_res,
    add_address,
    get_wallet_transaction,
    confirm_booking_total,
    add_wallet_transaction,
    get_order_by_size,
    get_addon_group,
    get_addon,
    get_categories,
    get_offers,
    remove_address,
    default_address,
    like,
    review,
    update_review,
    newuser,
    getRestaurantsNearbyResults,
    check_wallet_trans,
    add_transction,
    get_all_photos,
    get_fslider,
    get_by_categoray,
    get_distance,
    get_photos_by_id,
    get_menu_by_id,
    get_menu_cat,
    get_videos_by_id,
    get_buffet_by_id,
    get_menu_likes
};