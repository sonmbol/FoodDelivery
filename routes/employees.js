require('./function.js');
const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');






// GET all Employees
router.post('/', (req, res) => {
  const  st  = req.query.st;
  if (st=='1'){  
}
else if  (st=='2'){
  const  cat  = req.query.cat;
  const  lat  = req.query.lat;
  const  lon  = req.query.lon;
  get_by_categoray(cat,lat,lon,function (response){
    res.json({"by_categoray" : response });
    }); 
}
else if  (st=='3'){
   const  id  = req.query.id;
  const  user_id  = req.query.user_id;
  const  lat  = req.query.lat;
  const  lon  = req.query.lon;
  const get_branch2 = new Promise((resolve2, reject) => {
    mysqlConnection.query('SELECT   *,min(COALESCE(( 6371 * acos( cos( radians(?) ) *  cos( radians( lat ) ) * '
    + 'cos( radians( lon ) - radians(?) ) + sin( radians(?) ) * '
    + 'sin( radians( lat ) ) ) ), 0)) AS distance from  res_branchs where restaurant_id=? and close="0" GROUP by branch_id order by distance  LIMIT 1',[lat,lon,lat,id], (err, rows, fields) => {
        if(!err) {
          branch_id=rows[0].branch_id;
          get_resturant_by_id(id,branch_id,user_id,lat,lon,function (response){
            get_resturant_details_by_id(id,function (response2){
              get_photos_by_id(id,function (response3){
                get_menu_by_id(id,function (response4){
                  get_menu_cat(id,function (response5){
                    get_videos_by_id(id,function (response6){
                      get_banquets_by_id(id,function (response7){
                        get_buffet_by_id(id,function (response8){
                          get_menu_likes(id,user_id,function (response9){
              res.json({"resturant" : response,"resturant_details" : response2,"photos" : response3,"menu" : response4,"menu_cat" : response5,"videos" : response6
              ,"banquets" : response7,"buffet" : response8,"liked" : response9}); 
            });
        });
        });
      });
    });
  });
});
});
});



        }   });  }  );
}
else if  (st=='4'){
  get_fslider(function (response){
    res.json({"fslider" : response });
    }); 
}
else if  (st=='5'){
  get_all_photos(function (response){
    res.json({"photo" : response });
    }); 
}
else if  (st=='6'){
  var  tarns_id  = req.query.tarns_id;
  var  avenus_oid  = req.query.avenus_oid;
  var  user_id  = req.query.user_id;
  var  phone  = req.query.phone;
  var  type  = parseInt(req.query.type);
  var  amount=req.query.amount;
var  device=req.query.device;

if (typeof device == 'undefined') {
  device  = 2;
}
var  date=new Date();
var  status=req.query.status;
var  message=req.query.message;
  if(type == 1)
	{

  	 check_wallet_trans(function (response){
      order_id = response;
      add_transction(tarns_id,avenus_oid,user_id,phone,order_id,type,amount,message,device,date,status,function (response){
        res.json({"transction" : response });
        }); 
    });
    
  }
  else {
var	order_id=req.query.order_id;
add_transction(tarns_id,avenus_oid,user_id,phone,order_id,type,amount,message,device,date,status,function (response){
  res.json({"transction" : response });
  }); 
}

}
else if  (st=='7'){
  var  lat  = req.query.lat;
  var  lon  = req.query.lon;
  var radius  = 200.0000;

  if (typeof req.query.lat !== 'undefined' && typeof req.query.lon !== 'undefined' && typeof req.query.radius !== 'undefined') {
      lat  = req.query.lat;
      lon  = req.query.lon;
      radius  =  parseInt(req.query.radius);
             if(radius>5000){
    	        radius=5000;
                            }
  }
  getRestaurantsNearbyResults(lat,lon,radius,function (response){
    res.json({"nearby" : response });
    }); 
}
  else if  (st=='8'){
    const  uid  = req.query.uid;
    const  name  = req.query.name;
    const  fire  = req.query.fire;
    const  phone  = req.query.phone;
    const  email  = req.query.email;
    var  device  = req.query.device;
    if (typeof device == 'undefined') {
      device  = 2;
    }
    newuser(uid,name,fire,phone,email,device,function (response){
      res.json({"success" : response });
      }); 
  }
  else if  (st=='9'){
    const  id  = req.query.id.replace(/'/g, "\\'");
    const  user_id  = req.query.user_id.replace(/'/g, "\\'");
    const  foodr  = req.query.foodvalue.replace(/'/g, "\\'");
    const  servicesr  = req.query.servicesvalue.replace(/'/g, "\\'");
    const  pricerate  = req.query.pricevalue.replace(/'/g, "\\'");
    const  content  = req.query.content.replace(/'/g, "\\'");
    review(id,user_id,foodr,servicesr,pricerate,content,function (response){
      res.json({"success" : response });
      }); 
  }
  else if  (st=='10'){
    const  id  = req.query.id;
    const  offset  = parseInt(req.query.limit);
    get_reviews(id,offset,function (response){
      res.json({"reviews" : response });
      }); 
  }
  else if (st=='11'){
    const  id  = req.query.id;
    const  user_id  = req.query.user_id;
    const  menu_id  = req.query.menu_id;
    like(id,user_id,menu_id,function (response){
      res.json({"success" : response });
      });
  }
  else if (st=='12'){
    const  id  = req.query.id;
    const  user_id  = req.query.user_id;
    const  type  = req.query.type;
    if(type==1){
      remove_address(id,user_id,function (response){
        res.json({"success" : response });
        });
    }
    else{
      default_address(id,user_id,function (response){
        res.json({"success" : response });
        });
    }
  
  }
  else if (st=='13'){
    get_offers(function (response){
      res.json({"offers" : response}); 
    });
  }
  else if (st=='14'){
    get_categories(function (response){
      res.json({"categories" : response}); 
    });
  }
  else if (st=='15'){
    const  id  = req.query.item_id;
    get_order_by_size(id,function (response){
      get_addon_group(id,function (response2){
        get_addon(id,function (response3){
        res.json({"sizes" : response,"addon_group" : response2,"addon_item" : response3}); 
      });
  });
  });
  }
  //16 done
  else if  (st=='16'){
    const  user_id  = req.query.user_id;
    const  book_id  = req.query.book_id;
//    get_user_booking(res,user_id,book_id);
get_user_booking(user_id,book_id,function (response){
// console.log(response);
res.json({"booking" : response });
});
  }
  else if  (st=='17'){
    const  book_id  = req.query.id;
    const  user_id  = req.query.user_id;
    const  utotal  = req.query.utotal;
    const  total  = req.query.total;
    confirm_booking_total(user_id,book_id,total,utotal,function (response){
res.json({"booking" : response });
});
  }
  else if (st=='18'){
  //Leater
  }
  else if (st=='21'){
    const  user_id  = req.query.user_id;
    get_user_order(user_id,function (response){
      res.json({"orders" : response}); 
    });
  }
  else if (st=='22'){
    const  user_id  = req.query.user_id;
    const  address  = req.query.address;
    const  phone  = req.query.phone;
    const  area  = req.query.area;
    const  street  = req.query.street;
    const  building  = req.query.building;
    const  appartment  = req.query.appartment;
    const  floor  = req.query.floor;
    const  lat  = req.query.lat;
    const  lon  = req.query.lon;
    add_address(user_id,address,phone,area,building,appartment,floor,street,lat,lon,function (response){
      res.json({"success" : [response]}); 
    });
  }
  else if (st=='23'){
    const  user_id  = req.query.user_id;
    const  res_id  = req.query.res_id;
    get_all_address(user_id,function (response){
    get_profile(user_id,function (response2){
    get_resturant_details_by_id(res_id,function (response3){
    get_offers_by_res(res_id,function (response4){
      res.json({"address" : response,"user_profile" : response2,"resturant_details" : response3,"offers" : response4}); 
    });
});
});
});
  }
  else if (st=='24'){
    const  user_id  = req.query.user_id;
    get_all_address(user_id,function (response){
    get_user_bar(user_id,function (response2){
    get_profile(user_id,function (response3){
      res.json({"address" : response,"user_data" : response2,"user_profile" : response3}); 
    });
  });
});
  }
  else if (st=='25'){
    const  ticket_id  = req.query.ticket_id;
    const  user_id  = req.query.user_id;
    get_ticket(ticket_id,function (response){
      
      get_order_by_ticket(ticket_id,user_id,function (response2){
        res.json({"orders" : response2,"ticket" : response }); 
      });
    

      });
  
        
  }
  else if (st=='26'){
    const  user_id  = req.query.user_id;
    const  res_id  = req.query.res_id;
    const  date  = req.query.date;
    const  time  = req.query.time;
    const  num  = req.query.num;
    const  name  = req.query.name;
    const  phone  = req.query.phone;
    const  branch_id  = req.query.branch_id;
    //global.comm;
//   var comm = 15; 
    get_restaurant_comm(res_id,'3',function (response){
      //res.json( response );
        comm = JSON.parse(response[0].commission);
        
        add_booking(name,phone,user_id,res_id,branch_id,date,time,num,comm,function (response){
          res.json({"booking" : [response]});
          });
    }); 
//      console.log(comm);

      
      //console.log(comm);
//      console.log(JSON.stringify(comm));

  }
  else if (st=='27'){
    const  res_id  = req.query.res_id;
    get_banquets_by_id(res_id,function (response){
      res.json({"banquets" : response });
      });
  }
  else if (st=='28'){
    const  res_id  = req.query.res_id;
    const  lat  = req.query.lat;
    const  lon  = req.query.lon;
    get_branch(res_id,lat,lon,function (response){
      res.json({"branch" : response });
      });
  }

  else if (st=='29'){
    const  user_id  = req.query.user_id;
    get_wallet_transaction(user_id,function (response){
      res.json({"transactions" : response });
      });
  }

  else if (st=='30'){
    const  user_id  = req.query.user_id;
    get_wallet_transaction(user_id,function (response){
      res.json({"transactions" : response });
      });
  }

});

// GET An Employee
router.get('/:id', (req, res) => {
  const  id  = req.query.id; 
  const  main  = req.query.main; 
  mysqlConnection.query('SELECT * FROM branchs WHERE id = ? and main = ?', [id,main], (err, rows, fields) => {
    if (!err) {
      res.json(rows[0]);
    } else {
      console.log(err);
    }
  });
});

// DELETE An Employee
router.delete('/:id', (req, res) => {
  const  id  = req.query.id;
  mysqlConnection.query('select FROM ticket WHERE id = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Employee Deleted'});
    } else {
      console.log(err);
    }
  });
});

// INSERT An Employee
router.post('/', (req, res) => {
  const {id, name, salary} = req.body;
  console.log(id, name, salary);
  const query = `
    SET @id = ?;
    SET @name = ?;
    SET @salary = ?;
    CALL employeeAddOrEdit(@id, @name, @salary);
  `;
  mysqlConnection.query(query, [id, name, salary], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Employeed Saved'});
    } else {
      console.log(err);
    }
  });

});

router.put('/:id', (req, res) => {
  const { name, salary } = req.body;
  const { id } = req.params;
  const query = `
    SET @id = ?;
    SET @name = ?;
    SET @salary = ?;
    CALL employeeAddOrEdit(@id, @name, @salary);
  `;
  mysqlConnection.query(query, [id, name, salary], (err, rows, fields) => {
    if(!err) {
      res.json({status: 'Employee Updated'});
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
