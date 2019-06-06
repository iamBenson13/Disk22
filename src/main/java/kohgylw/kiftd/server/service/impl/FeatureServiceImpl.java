package kohgylw.kiftd.server.service.impl;

import kohgylw.kiftd.server.enumeration.AccountAuth;
import kohgylw.kiftd.server.mapper.*;
import kohgylw.kiftd.server.model.*;
import kohgylw.kiftd.server.service.*;
import com.google.gson.*;
import kohgylw.kiftd.server.util.ConfigureReader;
import org.springframework.stereotype.*;

import javax.annotation.*;
import javax.servlet.http.*;
import java.util.*;

/**
 * @author wzy
 * @create 2019-05-27  9:56
 */
@Service
public class FeatureServiceImpl implements FeatureService {

    @Resource
    private FeatureMapper featureMapper;
    @Resource
    private Gson gson;

    @Override
    public String getFeatureViewToJson(final HttpServletRequest request){
        List<Feature> featureList = new LinkedList<>();
        for (Feature f : this.featureMapper.getFeatures()) {
            featureList.add(f);

        }
        return gson.toJson(featureList);
    }

    //插入
    public String newFeature(final HttpServletRequest request) {
        final String featureId = request.getParameter("featureId");
        final String featureName = request.getParameter("featureName");
       Feature f=new Feature();
        f.setFeatureId(UUID.randomUUID().toString());
        f.setFeatureName(featureName);
        final List<Feature> feature = this.featureMapper.getFeatures();
        for(Feature a : feature){
            if(a.getFeatureName().equals(featureName)){
                return "nameOccupied";
            }
        }
        int i = 0;
        while (true) {
            try {
                final int r = this.featureMapper.insertNewFeature(f);
                if (r > 0) {
                    return "createFolderSuccess";
                }
                break;
            } catch (Exception e) {
                f.setFeatureId(UUID.randomUUID().toString());
                i++;
            }
            if (i >= 10) {
                break;
            }
        }
        return "cannotCreateFeature";
    }

    //删除
    public String deleteFeature(final HttpServletRequest request) {
        final String featureId = request.getParameter("featureId");
        if (featureId == null || featureId.length() <= 0) {
            return "errorParameter";
        }
        final Feature feature = this.featureMapper.getFeaturesById(featureId);
        if (feature == null) {
            return "deleteFeatureSuccess";
        }
        if(featureMapper.deleteById(featureId)>0){
            return "deleteFolderSuccess";
        }
        return "cannotDeleteFolder";
    }


    //修改
    public String renameFeature(final HttpServletRequest request) {
        final String featureId = request.getParameter("featureId");
        final String newFeatureName = request.getParameter("newFeatureName");
        final Feature feature = this.featureMapper.getFeaturesById(featureId);
        if (feature == null) {
            return "errorParameter";
        }
        final Map<String, String> map3 = new HashMap<String, String>();
        map3.put("featureId", featureId);
        map3.put("newFeatureName", newFeatureName);
        if(this.featureMapper.updateFeatureNameById(map3)==0){
            return "cannotRenameFeature";
        };
        return "renameFeatureSuccess";
    }
}
