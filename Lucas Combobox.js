<select name="kitchen_color" id="kitchen_color" onchange="setImage(this);">
  <option value="https://www.google.ru/images/srpr/logo4w.png">Google</option>
  <option value="http://yandex.st/www/1.645/yaru/i/logo.png">Yandex</option>
  <option value="http://limg.imgsmail.ru/s/images/logo/logo.v2.png">Mail</option>
</select><br />
<img src="" name="image-swap" />
<script>
function setImage(select){
  var image = document.getElementsByName("image-swap")[0];
  image.src = select.options[select.selectedIndex].value;
}
</script>
</p>