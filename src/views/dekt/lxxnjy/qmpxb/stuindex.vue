<template>
  <div class="app-container">
    <keep-alive>
      <kcList />
    </keep-alive>
  </div>
</template>

<script>
import kcList from "./component/kc";

export default {
  name: "qmpxbStu",
  components: { kcList }
};
</script>

