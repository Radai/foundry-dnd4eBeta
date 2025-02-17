/**
 * A specialized form used to select from a checklist of attributes, traits, or properties
 * @extends {FormApplication}
 */
export default class TraitSelectorSave extends FormApplication {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
	    id: "trait-selector",
      classes: ["dnd4eBeta"],
      title: "Actor Trait Selection",
      template: "systems/dnd4e/templates/apps/trait-selector-save.html",
      width: 320,
      height: "auto",
      choices: {},
      allowCustom: true,
      minimum: 0,
      maximum: null
    });
  }

  /* -------------------------------------------- */

  /**
   * Return a reference to the target attribute
   * @type {String}
   */
  get attribute() {
	  return this.options.name;
  }

	get title() {

		return `${this.object.name} - ${super.title}`;
	}
  /* -------------------------------------------- */

  /** @override */
  getData() {
	
    // Get current values
    let attr = getProperty(this.object, this.attribute) || {};
    attr.value = attr.value || [];
	
	// Populate choices
    let choices = duplicate(this.options.choices);
		
    for ( let [k, v] of Object.entries(choices) ) {
		let i = -1;
		
		for(let index = 0; index < attr.value.length; index++)
		{
			if(attr.value[index][0].includes(k))
				i = index;
		}
		
      choices[k] = {
        label: v,
		chosen: attr && i != -1 ? true : false,
		value: attr && i != -1 ? attr.value[i][1] : null 
      }
    }
	
    // Return data
	  return {
      allowCustom: this.options.allowCustom,
	    choices: choices,
      custom: attr ? attr.custom : ""
    }
  }

  /* -------------------------------------------- */

  /** @override */
  _updateObject(event, formData) {	  
	  
    const updateData = {};

    // Obtain choices
    const chosen = [];
    for ( let [k, v] of Object.entries(formData) ) {
      if ( (k !== "custom") && v) chosen.push([k,v]	);
    }
    updateData[`${this.attribute}.value`] = chosen;

    // Validate the number chosen
    if ( this.options.minimum && (chosen.length < this.options.minimum) ) {
      return ui.notifications.error(`You must choose at least ${this.options.minimum} options`);
    }
    if ( this.options.maximum && (chosen.length > this.options.maximum) ) {
      return ui.notifications.error(`You may choose no more than ${this.options.maximum} options`);
    }

    // Include custom
    if ( this.options.allowCustom ) {
      updateData[`${this.attribute}.custom`] = formData.custom;
    }

    // Update the object
    this.object.update(updateData);
  }
}
