import IGIconSwitch from '../components/ui/IGIconSwitch.vue'
import IGFileInput from '../components/ui/IGFileInput.vue'
import IGFileLoadButton from '../components/ui/IGFileLoadButton.vue'
import IGForm from '../components/ui/IGForm.vue'
import IGObjectViewer from '../components/ui/IGObjectViewer.vue'
import IGGeo from '../components/ui/IGGeo.vue'
import IGDialog from '../components/ui/IGDialog.vue'

import IGJsonViewer from '../components/ui/utils/IGJsonViewer.vue'
import IGFormSettings from '../components/ui/utils/IGFormSettings.vue'
import IGButtonWithConfirm from '../components/ui/IGButtonWithConfirm.vue'
import IGServicePicker from '../components/ui/pickers/IGServicePicker.vue'
import IGColorPicker from '../components/ui/pickers/IGColorPicker.vue'
import IGImageBasedPicker from '../components/ui/pickers/IGImageBasedPicker.vue'
import IGJSONPicker from '../components/ui/pickers/IGJSONPicker.vue'

import 'prismjs'
import 'prismjs/themes/prism.css'
import PrismEditor from 'vue-prism-editor'
import 'vue-prism-editor/dist/VuePrismEditor.css'

export default {
  install:
    function (Vue) {
      Vue.component('ig-iconswitch', IGIconSwitch)
      Vue.component('ig-fileinput', IGFileInput)
      Vue.component('ig-fileload-but', IGFileLoadButton)
      Vue.component('ig-form', IGForm)
      Vue.component('ig-object-viewer', IGObjectViewer)
      Vue.component('ig-geo', IGGeo)
      Vue.component('ig-dialog', IGDialog)

      Vue.component('ig-form-settings', IGFormSettings)
      Vue.component('ig-json-viewer', IGJsonViewer)
      Vue.component('ig-btn-confirm', IGButtonWithConfirm)
      Vue.component('ig-img-selector', IGServicePicker)
      Vue.component('ig-color-picker', IGColorPicker)
      Vue.component('ig-image-based-picker', IGImageBasedPicker)
      Vue.component('ig-json-picker', IGJSONPicker)

      Vue.component('prism-editor', PrismEditor)
    }
}
