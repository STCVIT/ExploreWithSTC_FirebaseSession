const form = document.getElementById("form3");

form.addEventListener('submit',(e)=>{
    (e).preventDefault();
});

const db = firebase.firestore();
var User;
var Bal;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

        User = user.uid;
        var docRef = db.collection("Users").doc(User);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                Bal = doc.data().Bal;
                document.getElementById('user_name').innerHTML = doc.data().Name;
                document.getElementById('total_balance').innerHTML = doc.data().Bal;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
      // ...
    } else {
      // User is signed out
      // ...
    }
  });


function send_money(){
    var Email = document.getElementById('email').value;
    var Amt = document.getElementById('amount').value;

    Amt = parseInt(Amt);

    if(Bal >= Amt) {
         db.collection('Users').where("Email","==",Email)
         .get()
         .then((querySnapshot) => {
             querySnapshot.forEach((doc)=>{
                 console.log(doc.id, doc.data())
                 db.collection('Users').doc(doc.id).update({
                     Bal : doc.data().Bal + Amt
                 })
             }) 
         }).then(()=>{
             db.collection('Users').doc(User).update({
                 Bal : Bal - Amt
             })
             alert('Transaction was successful')
             form.reset();
         }).catch((error)=>{
             console.log(error)
         })
    } else {
        alert('Insufficient Balance')
    }

}
