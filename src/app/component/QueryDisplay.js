import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const QueryDisplay = ({ originalQuery, executedQuery, resultCount }) => {
    // Parse the MongoDB query to extract readable fields
    const parseMongoQuery = (queryString) => {
        if (!queryString) return {};

        try {
            // Extract the Query part from the string
            const queryMatch = queryString.match(/Query: ({.*?}), Fields:/);
            if (queryMatch) {
                const queryJson = queryMatch[1];
                return JSON.parse(queryJson);
            }
        } catch (error) {
            console.error('Error parsing MongoDB query:', error);
        }
        return {};
    };

    // Extract searchable fields from the parsed query
    const extractSearchFields = (parsedQuery) => {
        const fields = [];

        const extractFieldsRecursive = (obj, path = '') => {
            if (typeof obj !== 'object' || obj === null) return;

            for (const [key, value] of Object.entries(obj)) {
                if (key === '$regularExpression' && typeof value === 'object') {
                    const pattern = value.pattern || '';
                    const options = value.options || '';
                    return { pattern, options };
                } else if (typeof value === 'object' && value !== null) {
                    const result = extractFieldsRecursive(value, path ? `${path}.${key}` : key);
                    if (result && result.pattern) {
                        fields.push({
                            field: path || key,
                            pattern: result.pattern,
                            options: result.options
                        });
                    }
                } else if (key !== '$and' && key !== '$or' && !key.startsWith('$')) {
                    const currentPath = path ? `${path}.${key}` : key;
                    if (typeof value === 'string') {
                        fields.push({
                            field: currentPath,
                            pattern: value,
                            options: ''
                        });
                    }
                }
            }
        };

        extractFieldsRecursive(parsedQuery);
        return fields;
    };

    const parsedQuery = parseMongoQuery(executedQuery);
    const searchFields = extractSearchFields(parsedQuery);

    if (!originalQuery) return null;

    return (
        <Box sx={{ margin: '20px 0' }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                        Search Query Information
                    </Typography>

                    {/* <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Original Search Query:
                        </Typography>
                        <TextField
                            fullWidth
                            value={originalQuery}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                            size="small"
                            sx={{ marginTop: 1 }}
                        />
                    </Box> */}

                    {searchFields.length > 0 && (
                        <Box sx={{ marginBottom: 2 }}>
                            {/* <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Searching in Database Fields:
                            </Typography> */}

                            {/* Group fields and show search terms */}
                            {/* <Box sx={{ marginTop: 1 }}>
                                {(() => {
                                    // Group by field name
                                    const fieldGroups = searchFields.reduce((groups, field) => {
                                        if (!groups[field.field]) {
                                            groups[field.field] = [];
                                        }
                                        groups[field.field].push(field.pattern);
                                        return groups;
                                    }, {});

                                    return Object.entries(fieldGroups).map(([fieldName, patterns], index) => (
                                        <Box key={index} sx={{ marginBottom: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline' }}>
                                                {fieldName}:
                                            </Typography>
                                            <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', gap: 0.5, marginLeft: 1 }}>
                                                {patterns.map((pattern, patternIndex) => (
                                                    <Chip
                                                        key={patternIndex}
                                                        label={`"${pattern}"`}
                                                        variant="outlined"
                                                        size="small"
                                                        color="primary"
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    ));
                                })()}
                            </Box> */}

                            {/* Show search terms summary */}
                            <Box sx={{ marginTop: 2, padding: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="caption" color="textSecondary">
                                    Search Terms: {searchFields.map(f => f.pattern).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Results Found: <strong>{resultCount || 0}</strong> properties
                        </Typography>
                    </Box>

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="query-details"
                        >
                            <Typography variant="subtitle2">
                                View Full MongoDB Query (Advanced)
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={executedQuery || 'No query executed'}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontFamily: 'monospace',
                                    '& .MuiInputBase-input': {
                                        fontFamily: 'monospace',
                                        fontSize: '0.8rem'
                                    }
                                }}
                            />
                        </AccordionDetails>
                    </Accordion>
                </CardContent>
            </Card>
        </Box>
    );
};

export default QueryDisplay;