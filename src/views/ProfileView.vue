<template>
  <div class="profile-layout">
    <ig-form v-if="schema" class="profile-form"
      v-model="user" :schema.sync="schema">
    </ig-form>

    <div class="profile-section--header">{{ $t('Modify password') }}</div>

    <div class="profile-section">
      <v-text-field type="password"
        v-model="password" autocomplete="off"
        :label="$t('Password')"></v-text-field>
      <v-progress-linear rounded style="margin-bottom: 16px;"
        :value="passwordScore / 5 * 100"
        :color="passwordScore < 3 ? 'red darken-1' : 'green darken-1'"></v-progress-linear>
      <v-text-field type="password"
        v-model="passwordCheck" autocomplete="off"
        :label="$t('Password check')"></v-text-field>
      <v-btn color="green darken-1" dark
        :disabled="!passwordChangeValid"
        @click="handlePasswordUpdate">{{ $t('Update')}}</v-btn>
    </div>
  </div>
</template>

<script>
import Password from 'password.js'
import cloneDeep from 'lodash/cloneDeep'
import { loadSchema } from '../commons'

export default {
  data: () => {
    return {
      user: null,
      schema: null,
      userModified: false,
      schemaDialog: false,
      password: '',
      passwordCheck: '',
      passwordChangeValid: false,
      passwordScore: 0
    }
  },
  watch: {
    user: {
      handler: function(val, old) {
        this.userModified = true
        if (old) {
          this.$services.emit('view:profile:modified', true)
        }
      },
      deep: true
    },
    password: function(val) {
      this.passwordScore = Password.rank(val)
    },
    passwordCheck: function(val) {
      if (val && this.password === val && this.passwordScore >= 3) {
        this.passwordChangeValid = true
      } else {
        this.passwordChangeValid = false
      }
    }
  },
  methods: {
    update() {
      this.$db.collection('users').then(usersCollection => {
        usersCollection.dFind(this.user).then(result => {
          console.log(result)
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    },
    handleSaveItem() {
      this.$db.collection('users').then(async usersCollection => {
        try {
          let result
          if (this.user._id) {
            let toSave = cloneDeep(this.user)
            delete toSave._id
            result = await usersCollection.dUpdate({
              'login.username': this.user.login.username
            }, toSave)
          } else {
            result = await usersCollection.dPut(this.item)
            this.user._id = result._id
          }

          this.userModified = false
          this.$services.emit('view:profile:modified', false)
          this.$services.emit('app:notification', this.$t('Modification done'))
        } catch (err) {
          console.log(err)
          this.$services.emit('app:notification', this.$t('Modification failed'))
        }
      }).catch(err => console.log(err))
    },
    handlePasswordUpdate() {
      this.$services.waitForService('auth').then(authService => {
        authService.chpwd(this.password).then(() => {
          this.userModified = false
          this.password = ''
          this.passwordCheck = ''
          this.$services.emit('view:profile:modified', false)
          this.$services.emit('app:notification', this.$t('Modification done'))
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }
  },
  async mounted() {
    this.schema = await loadSchema(this, 'users')

    if (this.$router.currentRoute.path === '/signup') {
      console.log('new user')
      this.user = this.$utils.generateDataFormJSONSchema(this.schema).json
    } else {
      this.$utils.waitForProperty(this.$store.state, 'user').then(async user => {
        this.$db.collection('users').then(async users => {
          this.user = await users.dGet({
            'login.username': user.login.username
          })

          this.user.role = user.role
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }

    this._listeners = {
      onItemSave: this.handleSaveItem.bind(this)
    }

    this.$services.emit('app:context:bar', 'profile-ctx')

    this.$services.on('view:profile:save', this._listeners.onItemSave)
  },
  beforeDestroy() {
    this.$services.emit('app:context:bar', null)

    this.$services.off('view:profile:save', this._listeners.onItemSave)
  }
}
</script>

<style>
.profile-layout {
  width: 100%;
  height: calc(100% - 32px);
  display: flex;
  flex-flow: column;
  align-items: center;
  overflow-y: auto;
}

.profile-form {
  width: 66%;
  height: auto!important;
  margin: 0px 15%;
}

.profile-section {
  margin: 8px 0;
  width: 66%;
  padding: 0 20%;
}

.profile-section--header {
  width: 66%;
  margin-top: 24px;
  font-weight: bold;
}

@media screen and (max-width: 600px) {
  .profile-section {
    width: 100%;
    padding: 0 8px;
  }

  .profile-form {
    width: 100%;
    margin: 0 0;
    padding: 0 8px;
  }

  .profile-section--header {
    width: 100%;
    padding: 0 8px;
  }
}
</style>
