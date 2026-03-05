export const USER_TYPE_OPTIONS = [
    'Admin',
    'Agent',
    'Indian Lead Agent',
    'Care Agent',
    'Other',
];

export const LEAD_TYPE_OPTIONS = ['Care Lead', 'Indian Lead', 'Other'];

const FULL_ACCESS_USER_TYPES = new Set(['Admin', 'Agent']);
const BLANK_LEAD_ACCESS_USER_TYPES = new Set(['Indian Lead Agent']);

const LEAD_TYPE_BY_USER_TYPE = {
    'Care Agent': ['Care Lead'],
    'Indian Lead Agent': ['Indian Lead'],
    Other: ['Other'],
};

const normalizeStringArray = (items = []) => (
    [...new Set(items
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter(Boolean))]
);

const parseUserTypesString = (value = '') => {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[')) {
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return normalizeStringArray(parsed);
        } catch {
            // Fall through to other parsing rules.
        }
    }

    if (trimmed.includes(',')) {
        return normalizeStringArray(trimmed.split(','));
    }

    return [trimmed];
};

export const normalizeUserTypes = (userTypes) => {
    if (Array.isArray(userTypes)) {
        return normalizeStringArray(userTypes);
    }

    if (typeof userTypes === 'string') {
        return parseUserTypesString(userTypes);
    }

    return [];
};

export const getPrimaryUserType = (userTypes) => normalizeUserTypes(userTypes)[0] || '';

export const formatUserTypes = (userTypes) => normalizeUserTypes(userTypes).join(', ');

export const hasUserType = (userTypes, expectedType) => (
    normalizeUserTypes(userTypes).includes(expectedType)
);

export const hasAnyUserType = (userTypes, expectedTypes = []) => {
    const normalized = normalizeUserTypes(userTypes);
    return expectedTypes.some((type) => normalized.includes(type));
};

export const hasFullLeadAccess = (userTypes) => (
    hasAnyUserType(userTypes, [...FULL_ACCESS_USER_TYPES])
);

const normalizeLeadType = (leadType) => (
    typeof leadType === 'string' ? leadType.trim() : ''
);

export const canAccessLead = (userTypes, leadType) => {
    const normalizedTypes = normalizeUserTypes(userTypes);
    if (!normalizedTypes.length) return false;

    if (hasFullLeadAccess(normalizedTypes)) return true;

    const normalizedLeadType = normalizeLeadType(leadType);

    if (!normalizedLeadType) {
        return normalizedTypes.some((type) => BLANK_LEAD_ACCESS_USER_TYPES.has(type));
    }

    return normalizedTypes.some((type) => (
        LEAD_TYPE_BY_USER_TYPE[type]?.includes(normalizedLeadType)
    ));
};

export const filterLeadsByUserTypes = (leads = [], userTypes) => (
    leads.filter((lead) => canAccessLead(userTypes, lead?.lead_type))
);

export const getUserTypesFromStorage = () => {
    const storedUserTypes = localStorage.getItem('userTypes');
    const normalizedFromUserTypes = normalizeUserTypes(storedUserTypes);
    if (normalizedFromUserTypes.length) return normalizedFromUserTypes;

    const storedUserType = localStorage.getItem('userType');
    return normalizeUserTypes(storedUserType);
};
