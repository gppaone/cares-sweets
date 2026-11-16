export interface SettingField {
	key: string;
	label: string;
	hint?: string;
	type: 'text' | 'textarea';
}

/** Fields shown on the admin "Site info" page. Keys are stored in the `settings` table. */
export const SETTING_FIELDS: SettingField[] = [
	{
		key: 'announcement',
		label: 'Announcement banner',
		hint: 'Shown at the very top of the site, e.g. "Closed Thursday for the holiday". Leave empty to hide.',
		type: 'text'
	},
	{
		key: 'about_text',
		label: 'About us text',
		hint: 'Leave a blank line between paragraphs.',
		type: 'textarea'
	},
	{ key: 'phone', label: 'Phone', type: 'text' },
	{ key: 'email', label: 'Public email (shown on the contact section)', type: 'text' },
	{ key: 'facebook', label: 'Facebook page URL', hint: 'Full link starting with https://', type: 'text' },
	{ key: 'instagram', label: 'Instagram URL', hint: 'Full link starting with https://', type: 'text' }
];

export const DEFAULT_SETTINGS: Record<string, string> = {
	announcement: '',
	about_text:
		"Care's Sweets & Salty Treats is a little food truck with a big love for homemade goodness. Everything we serve, from warm cider donuts and cookies to fresh-baked breads and creamy ice cream, is made with care.\n\nCome for something sweet, stay for something salty. We can't wait to meet you at the window!",
	phone: '',
	email: '',
	facebook: '',
	instagram: '',
	// Guest-baker section (edited on the admin "Joe's Dough" page)
	partner_enabled: 'false',
	partner_name: "Joe's Dough to Go",
	partner_blurb:
		"Our friends at Joe's Dough to Go bake fresh breads and pastries that we are happy to sell right from our window.",
	partner_note: ''
};
